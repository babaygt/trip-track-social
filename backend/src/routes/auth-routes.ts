import express, { Request, Response, Router } from 'express'
import { AuthService } from '../services/auth-service'
import { body, validationResult } from 'express-validator'

const router: Router = express.Router()
const authService = new AuthService()

// Login
router.post(
	'/login',
	[
		body('email').isEmail().normalizeEmail(),
		body('password').trim().notEmpty(),
	],
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() })
			}

			const { email, password } = req.body
			const user = await authService.login(email, password)

			// Set session data
			req.session.userId = user.id
			req.session.isAdmin = user.isAdmin

			res.json({
				id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
			})
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'An unknown error occurred'
			res.status(401).json({ message: errorMessage })
		}
	}
)

export default router
