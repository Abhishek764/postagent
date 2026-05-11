import { z } from 'zod'
import prisma from '../lib/prisma.js'

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  githubUsername: z.string().min(1, 'GitHub username cannot be empty').optional(),
  leetcodeUsername: z.string().min(1, 'LeetCode username cannot be empty').optional()
})

export async function getProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        githubUsername: true,
        leetcodeUsername: true,
        currentDay: true,
        streak: true,
        lastActiveDate: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    next(error)
  }
}

export async function updateProfile(req, res, next) {
  try {
    const validated = updateProfileSchema.parse(req.body)

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: validated,
      select: {
        id: true,
        email: true,
        name: true,
        githubUsername: true,
        leetcodeUsername: true,
        currentDay: true,
        streak: true,
        lastActiveDate: true,
        createdAt: true,
        updatedAt: true
      }
    })

    res.json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.name = 'ZodError'
    }
    next(error)
  }
}
