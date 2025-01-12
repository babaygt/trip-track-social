import express, { Request, Response, Router } from 'express'
import { UserService } from '../services/user-service'

const router: Router = express.Router()
const userService = new UserService()

/**
 * @swagger
 * /users/find/{username}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by username
 *     description: Retrieve user information by their username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user to retrieve
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid username provided
 */
router.get('/find/:username?', async (req: Request, res: Response) => {
	const { username } = req.params

	if (!username || username.trim() === '') {
		return res.status(400).json({ message: 'Username is required' })
	}

	try {
		const user = await userService.getUserByUsername(username)
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

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Register a new user in the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "********"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 */
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

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     description: Retrieve user information by their ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
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

/**
 * @swagger
 * /users/{userId}/password:
 *   put:
 *     tags: [Users]
 *     summary: Update user password
 *     description: Update the password for a specific user
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid password data
 *       401:
 *         description: Incorrect old password
 */
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

/**
 * @swagger
 * /users/{userId}/follow/{targetUserId}:
 *   post:
 *     tags: [Users]
 *     summary: Follow a user
 *     description: Make the current user follow another user
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user who wants to follow
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to be followed
 *     responses:
 *       200:
 *         description: Successfully followed user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request or user already followed
 */
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

/**
 * @swagger
 * /users/{userId}/follow/{targetUserId}:
 *   delete:
 *     tags: [Users]
 *     summary: Unfollow a user
 *     description: Make the current user unfollow another user
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user who wants to unfollow
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to be unfollowed
 *     responses:
 *       200:
 *         description: Successfully unfollowed user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request or user not followed
 */
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

/**
 * @swagger
 * /users/{userId}/followers:
 *   get:
 *     tags: [Users]
 *     summary: Get user followers
 *     description: Retrieve the list of followers for a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of followers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request
 */
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

/**
 * @swagger
 * /users/{userId}/following:
 *   get:
 *     tags: [Users]
 *     summary: Get users being followed
 *     description: Retrieve the list of users that a specific user is following
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of following users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request
 */
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

/**
 * @swagger
 * /users/{userId}/bookmarks/{routeId}:
 *   post:
 *     tags: [Users]
 *     summary: Bookmark a route
 *     description: Add a route to user's bookmarks
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the route to bookmark
 *     responses:
 *       200:
 *         description: Route bookmarked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request or route already bookmarked
 */
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

/**
 * @swagger
 * /users/{userId}/bookmarks/{routeId}:
 *   delete:
 *     tags: [Users]
 *     summary: Remove a bookmark
 *     description: Remove a route from user's bookmarks
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the route to remove from bookmarks
 *     responses:
 *       200:
 *         description: Bookmark removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request or route not bookmarked
 */
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

/**
 * @swagger
 * /users/{userId}/profile:
 *   patch:
 *     tags: [Users]
 *     summary: Update user profile
 *     description: Update profile information for a specific user
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               bio:
 *                 type: string
 *                 example: "I love hiking!"
 *               profilePicture:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid profile data
 */
router.patch('/:userId/profile', async (req: Request, res: Response) => {
	try {
		const { name, bio, profilePicture } = req.body
		const user = await userService.updateProfile(req.params.userId, {
			name,
			bio,
			profilePicture,
		})
		res.json(user)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

export default router
