import { Router } from 'express'
import { getUserPosts, deletePost } from '../controllers/posts.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/', getUserPosts)
router.delete('/:id', deletePost)

export default router
