import { Router } from 'express'
import { getProfile, updateProfile } from '../controllers/user.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/profile', getProfile)
router.patch('/profile', updateProfile)

export default router
