import { z } from 'zod'
import prisma from '../lib/prisma.js'
import { fetchGitHubActivity } from '../services/github.service.js'
import { fetchLeetCodeActivity } from '../services/leetcode.service.js'
import { generateLinkedInPost } from '../services/claude.service.js'

const generateSchema = z.object({
  story: z.string().min(20, 'Story must be at least 20 characters').max(1000, 'Story must be at most 1000 characters'),
  postType: z.enum(['leetcode', 'project', 'opensource', 'general'], {
    errorMap: () => ({ message: 'Post type must be one of: leetcode, project, opensource, general' })
  }),
  dayNumber: z.number().int().min(1, 'Day number must be at least 1')
})

function calculateStreak(lastActiveDate, currentStreak) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (!lastActiveDate) {
    return 1
  }

  const lastActive = new Date(lastActiveDate)
  lastActive.setHours(0, 0, 0, 0)

  const diffTime = today.getTime() - lastActive.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return currentStreak || 1
  } else if (diffDays === 1) {
    return currentStreak + 1
  } else {
    return 1
  }
}

export async function generate(req, res, next) {
  try {
    const validated = generateSchema.parse(req.body)

    // Fetch user to get GitHub/LeetCode usernames
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Fetch GitHub and LeetCode data in parallel
    const [githubResult, leetcodeResult] = await Promise.allSettled([
      user.githubUsername ? fetchGitHubActivity(user.githubUsername) : Promise.resolve(null),
      user.leetcodeUsername ? fetchLeetCodeActivity(user.leetcodeUsername) : Promise.resolve(null)
    ])

    const githubData = githubResult.status === 'fulfilled' ? githubResult.value : null
    const leetcodeData = leetcodeResult.status === 'fulfilled' ? leetcodeResult.value : null

    // Generate LinkedIn post via Claude
    const postText = await generateLinkedInPost({
      story: validated.story,
      dayNumber: validated.dayNumber,
      postType: validated.postType,
      githubData,
      leetcodeData
    })

    // Calculate new streak
    const newStreak = calculateStreak(user.lastActiveDate, user.streak)

    // Save post to DB
    const post = await prisma.post.create({
      data: {
        userId: user.id,
        dayNumber: validated.dayNumber,
        postType: validated.postType,
        story: validated.story,
        generatedPost: postText,
        githubDataUsed: githubData ? JSON.stringify(githubData) : null,
        leetcodeDataUsed: leetcodeData ? JSON.stringify(leetcodeData) : null,
        characterCount: postText.length
      }
    })

    // Update user: increment currentDay, update streak and lastActiveDate
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentDay: user.currentDay + 1,
        streak: newStreak,
        lastActiveDate: new Date()
      }
    })

    res.status(201).json({
      post: postText,
      githubData,
      leetcodeData,
      dayNumber: validated.dayNumber,
      characterCount: postText.length
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.name = 'ZodError'
    }
    next(error)
  }
}
