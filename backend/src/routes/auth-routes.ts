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

// Logout
router.post('/logout', (req: Request, res: Response) => {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).json({ message: 'Could not log out' })
		}
		res.clearCookie('connect.sid')
		res.json({ message: 'Logged out successfully' })
	})
})

// Get current session
router.get('/session', async (req: Request, res: Response) => {
	try {
		if (!req.session.userId) {
			return res.status(401).json({ message: 'No active session' })
		}

		const user = await authService.validateSession(req.session.userId)
		res.json({
			id: user.id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		})
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(401).json({ message: errorMessage })
	}
})

export default router
