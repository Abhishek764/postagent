export async function fetchLeetCodeActivity(username) {
  try {
    const controller1 = new AbortController()
    const timeout1 = setTimeout(() => controller1.abort(), 8000)

    const controller2 = new AbortController()
    const timeout2 = setTimeout(() => controller2.abort(), 8000)

    const [profileResult, submissionsResult] = await Promise.allSettled([
      fetch(
        `https://alfa-leetcode-api.onrender.com/userProfile/${encodeURIComponent(username)}`,
        { signal: controller1.signal }
      ).then(res => {
        clearTimeout(timeout1)
        if (!res.ok) throw new Error('Profile fetch failed')
        return res.json()
      }),
      fetch(
        `https://alfa-leetcode-api.onrender.com/recentAcSubmissions?username=${encodeURIComponent(username)}&limit=5`,
        { signal: controller2.signal }
      ).then(res => {
        clearTimeout(timeout2)
        if (!res.ok) throw new Error('Submissions fetch failed')
        return res.json()
      })
    ])

    clearTimeout(timeout1)
    clearTimeout(timeout2)

    let profile = null
    let recentSolved = []

    if (profileResult.status === 'fulfilled' && profileResult.value) {
      const data = profileResult.value
      profile = {
        totalSolved: data.totalSolved || 0,
        easySolved: data.easySolved || 0,
        mediumSolved: data.mediumSolved || 0,
        hardSolved: data.hardSolved || 0,
        ranking: data.ranking || 0
      }
    }

    if (submissionsResult.status === 'fulfilled' && submissionsResult.value) {
      const submissions = Array.isArray(submissionsResult.value)
        ? submissionsResult.value
        : submissionsResult.value.submission || []

      recentSolved = submissions.slice(0, 5).map(sub => ({
        title: sub.title || sub.titleSlug || 'Unknown',
        difficulty: sub.difficulty || 'Unknown'
      }))
    }

    // If both failed, return null
    if (!profile && recentSolved.length === 0) {
      return null
    }

    // Build summary
    const parts = []
    if (profile) {
      parts.push(`LeetCode profile: ${profile.totalSolved} problems solved total (${profile.easySolved} Easy, ${profile.mediumSolved} Medium, ${profile.hardSolved} Hard).`)
      if (profile.ranking) {
        parts.push(`Ranking: ${profile.ranking.toLocaleString()}.`)
      }
    }
    if (recentSolved.length > 0) {
      parts.push(`Recently solved: ${recentSolved.map(s => `"${s.title}" (${s.difficulty})`).join(', ')}.`)
    }

    const summary = parts.join(' ')

    return {
      profile,
      recentSolved,
      summary
    }
  } catch (error) {
    return null
  }
}
