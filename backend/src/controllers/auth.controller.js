import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import prisma from '../lib/prisma.js'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters')
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

function generateAccessToken(userId, email) {
  return jwt.sign({ userId, email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' })
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  }
}

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
    // Same day — keep streak
    return currentStreak
  } else if (diffDays === 1) {
    // Yesterday — increment
    return currentStreak + 1
  } else {
    // Older — reset
    return 1
  }
}

export async function register(req, res, next) {
  try {
    const validated = registerSchema.parse(req.body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email }
    })

    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validated.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        passwordHash,
        name: validated.name
      }
    })

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email)
    const refreshToken = generateRefreshToken(user.id)

    // Save refresh token to DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    // Set refresh token cookie
    res.cookie('refresh_token', refreshToken, getRefreshCookieOptions())

    // Return user data + access token
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        currentDay: user.currentDay,
        streak: user.streak
      },
      accessToken
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.name = 'ZodError'
    }
    next(error)
  }
}

export async function login(req, res, next) {
  try {
    const validated = loginSchema.parse(req.body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validated.email }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Compare password
    const isValid = await bcrypt.compare(validated.password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Calculate streak
    const newStreak = calculateStreak(user.lastActiveDate, user.streak)

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastActiveDate: new Date(),
        streak: newStreak
      }
    })

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email)
    const refreshToken = generateRefreshToken(user.id)

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    // Set cookie
    res.cookie('refresh_token', refreshToken, getRefreshCookieOptions())

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        currentDay: user.currentDay,
        streak: newStreak,
        githubUsername: user.githubUsername,
        leetcodeUsername: user.leetcodeUsername,
        lastActiveDate: new Date()
      },
      accessToken
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.name = 'ZodError'
    }
    next(error)
  }
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refresh_token

    if (!token) {
      return res.status(401).json({ error: 'Refresh token is required' })
    }

    // Find token in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token }
    })

    if (!storedToken) {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    // Check expiry
    if (new Date() > storedToken.expiresAt) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } })
      return res.status(401).json({ error: 'Refresh token has expired' })
    }

    // Verify JWT signature
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch (err) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } })
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    // Issue new access token only
    const accessToken = generateAccessToken(user.id, user.email)

    res.json({ accessToken })
  } catch (error) {
    next(error)
  }
}

export async function logout(req, res, next) {
  try {
    const token = req.cookies?.refresh_token

    if (token) {
      // Delete from DB — soft fail if not found
      await prisma.refreshToken.deleteMany({
        where: { token }
      })
    }

    // Clear cookie
    res.clearCookie('refresh_token', getRefreshCookieOptions())

    res.json({ message: 'Logged out' })
  } catch (error) {
    next(error)
  }
}
