import { Router } from 'express'
import { generate } from '../controllers/generate.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authMiddleware)

router.post('/', generate)

export default router
