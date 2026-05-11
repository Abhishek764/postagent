import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import generateRoutes from './routes/generate.routes.js'
import postsRoutes from './routes/posts.routes.js'
import { errorMiddleware } from './middleware/error.middleware.js'

const app = express()

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/generate', generateRoutes)
app.use('/api/posts', postsRoutes)

app.use(errorMiddleware)

export default app
