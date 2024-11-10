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

// Get user by ID
router.get('/:userId', async (req: Request, res: Response) => {
	try {
		const user = await userService.findById(req.params.userId)
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}
		res.json(user)
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

// Follow user
router.post(
	'/:userId/follow/:targetUserId',
	async (req: Request, res: Response) => {
		try {
			const user = await userService.followUser(
				req.params.userId,
				req.params.targetUserId
			)
			res.json(user)
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'An unknown error occurred'
			res.status(400).json({ message: errorMessage })
		}
	}
)

// Unfollow user
router.delete(
	'/:userId/follow/:targetUserId',
	async (req: Request, res: Response) => {
		try {
			const user = await userService.unfollowUser(
				req.params.userId,
				req.params.targetUserId
			)
			res.json(user)
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'An unknown error occurred'
			res.status(400).json({ message: errorMessage })
		}
	}
)

// Get followers
router.get('/:userId/followers', async (req: Request, res: Response) => {
	try {
		const followers = await userService.getFollowers(req.params.userId)
		res.json(followers)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

// Get following
router.get('/:userId/following', async (req: Request, res: Response) => {
	try {
		const following = await userService.getFollowing(req.params.userId)
		res.json(following)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

// Bookmark route
router.post(
	'/:userId/bookmarks/:routeId',
	async (req: Request, res: Response) => {
		try {
			const user = await userService.bookmarkRoute(
				req.params.userId,
				req.params.routeId
			)
			res.json(user)
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'An unknown error occurred'
			res.status(400).json({ message: errorMessage })
		}
	}
)

// Remove bookmark
router.delete(
	'/:userId/bookmarks/:routeId',
	async (req: Request, res: Response) => {
		try {
			const user = await userService.removeBookmark(
				req.params.userId,
				req.params.routeId
			)
			res.json(user)
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'An unknown error occurred'
			res.status(400).json({ message: errorMessage })
		}
	}
)

export default router
