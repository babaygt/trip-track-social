import express, { Request, Response, Router } from 'express'
import { UserService } from '../services/user-service'

const router: Router = express.Router()
const userService = new UserService()

// Create user
router.post('/', async (req: Request, res: Response) => {
	try {
		const user = await userService.createUser(req.body)
		res.status(201).json(user)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

// Update password
router.put('/:userId/password', async (req: Request, res: Response) => {
	try {
		const { oldPassword, newPassword } = req.body
		const user = await userService.updatePassword(
			req.params.userId,
			oldPassword,
			newPassword
		)
		res.json(user)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

export default router
