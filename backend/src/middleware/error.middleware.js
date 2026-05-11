export function errorMiddleware(err, req, res, next) {
  console.error(`[Error] ${err.message}`)

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field'
    return res.status(409).json({
      error: `A record with this ${field} already exists`
    })
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    const messages = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }))
    return res.status(400).json({
      error: 'Validation failed',
      details: messages
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Authentication failed' })
  }

  // Default error
  const statusCode = err.statusCode || 500
  const message = statusCode === 500 && process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'Internal server error'

  res.status(statusCode).json({ error: message })
}
