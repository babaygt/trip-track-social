import express, { Request, Response, Router } from 'express'
import { AuthService } from '../services/auth-service'
import { body, validationResult } from 'express-validator'
import 'express-session'

const router: Router = express.Router()
const authService = new AuthService()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login to the application
 *     description: Authenticate user and create a session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "********"
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Authentication failed
 */
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

			res.json(user)
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'An unknown error occurred'
			res.status(401).json({ message: errorMessage })
		}
	}
)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout from the application
 *     description: Destroy the current session
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Not authenticated
 */
router.post('/logout', (req: Request, res: Response) => {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).json({ message: 'Could not log out' })
		}
		res.clearCookie('connect.sid')
		res.json({ message: 'Logged out successfully' })
	})
})

/**
 * @swagger
 * /auth/session:
 *   get:
 *     tags: [Auth]
 *     summary: Validate current session
 *     description: Check if the current session is valid and return user data
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Session is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Session is invalid or expired
 */
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
