export async function fetchGitHubActivity(username) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/events?per_page=30`,
      {
        headers: { 'User-Agent': 'PostAgent/1.0' },
        signal: controller.signal
      }
    )

    clearTimeout(timeout)

    if (!response.ok) {
      return null
    }

    const events = await response.json()

    if (!Array.isArray(events)) {
      return null
    }

    // Filter events from last 48 hours only
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000)
    const recentEvents = events.filter(e => new Date(e.created_at) > cutoff)

    const commits = []
    const pullRequests = []
    const newBranches = []

    for (const event of recentEvents) {
      switch (event.type) {
        case 'PushEvent': {
          const repo = event.repo?.name || 'unknown'
          const eventCommits = event.payload?.commits || []
          for (const commit of eventCommits) {
            commits.push({
              repo,
              message: commit.message
            })
          }
          break
        }

        case 'PullRequestEvent': {
          const repo = event.repo?.name || 'unknown'
          const pr = event.payload?.pull_request
          if (pr) {
            pullRequests.push({
              repo,
              title: pr.title,
              action: event.payload.action
            })
          }
          break
        }

        case 'CreateEvent': {
          const repo = event.repo?.name || 'unknown'
          if (event.payload?.ref_type === 'branch') {
            newBranches.push({
              repo,
              ref: event.payload.ref
            })
          }
          break
        }
      }
    }

    // Build summary
    const parts = []
    if (commits.length > 0) {
      parts.push(`Made ${commits.length} commit${commits.length === 1 ? '' : 's'} across ${[...new Set(commits.map(c => c.repo))].length} repo${[...new Set(commits.map(c => c.repo))].length === 1 ? '' : 's'}.`)
      const topCommits = commits.slice(0, 3)
      parts.push(`Recent commits: ${topCommits.map(c => `"${c.message}" in ${c.repo}`).join(', ')}.`)
    }
    if (pullRequests.length > 0) {
      parts.push(`${pullRequests.length} pull request${pullRequests.length === 1 ? '' : 's'}: ${pullRequests.map(pr => `${pr.action} "${pr.title}" in ${pr.repo}`).join(', ')}.`)
    }
    if (newBranches.length > 0) {
      parts.push(`Created ${newBranches.length} new branch${newBranches.length === 1 ? '' : 'es'}: ${newBranches.map(b => `${b.ref} in ${b.repo}`).join(', ')}.`)
    }

    const summary = parts.length > 0
      ? parts.join(' ')
      : 'No significant GitHub activity in the last 48 hours.'

    return {
      commits,
      pullRequests,
      newBranches,
      summary
    }
  } catch (error) {
    return null
  }
}
