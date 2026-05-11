import prisma from '../lib/prisma.js'

export async function getUserPosts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10))
    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { userId: req.user.userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.post.count({
        where: { userId: req.user.userId }
      })
    ])

    res.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    next(error)
  }
}

export async function deletePost(req, res, next) {
  try {
    const { id } = req.params

    const post = await prisma.post.findUnique({
      where: { id }
    })

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    if (post.userId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only delete your own posts' })
    }

    await prisma.post.delete({
      where: { id }
    })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
