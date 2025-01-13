import express, { Request, Response, Router } from 'express'
import { RouteService } from '../services/route-service'

const router: Router = express.Router()
const routeService = new RouteService()

/**
 * @swagger
 * components:
 *   schemas:
 *     Point:
 *       type: object
 *       properties:
 *         lat:
 *           type: number
 *           description: Latitude coordinate
 *         lng:
 *           type: number
 *           description: Longitude coordinate
 *       required:
 *         - lat
 *         - lng
 *
 *     Route:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the route
 *         title:
 *           type: string
 *           description: Route title
 *         creator:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             username:
 *               type: string
 *             profilePicture:
 *               type: string
 *         startPoint:
 *           $ref: '#/components/schemas/Point'
 *         endPoint:
 *           $ref: '#/components/schemas/Point'
 *         travelMode:
 *           type: string
 *           enum: [DRIVING, WALKING, BICYCLING, TRANSIT]
 *         description:
 *           type: string
 *         totalDistance:
 *           type: number
 *         totalTime:
 *           type: number
 *         visibility:
 *           type: string
 *           enum: [public, private]
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               user:
 *                 type: string
 *               content:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *       required:
 *         - title
 *         - creator
 *         - startPoint
 *         - endPoint
 *         - travelMode
 */

/**
 * @swagger
 * /routes:
 *   post:
 *     summary: Create a new route
 *     tags: [Routes]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               startPoint:
 *                 $ref: '#/components/schemas/Point'
 *               endPoint:
 *                 $ref: '#/components/schemas/Point'
 *               travelMode:
 *                 type: string
 *                 enum: [DRIVING, WALKING, BICYCLING, TRANSIT]
 *               description:
 *                 type: string
 *               totalDistance:
 *                 type: number
 *               totalTime:
 *                 type: number
 *               visibility:
 *                 type: string
 *                 enum: [public, private]
 *     responses:
 *       201:
 *         description: Route created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Route'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

// Create route
router.post('/', async (req: Request, res: Response) => {
	try {
		const route = await routeService.createRoute(req.body)
		res.status(201).json(route)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

/**
 * @swagger
 * /routes/{routeId}/like/{userId}:
 *   post:
 *     summary: Like a route
 *     tags: [Routes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the route to like
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user liking the route
 *     responses:
 *       200:
 *         description: Route liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Route'
 *       400:
 *         description: Invalid request or route already liked
 *       404:
 *         description: Route not found
 */

// Like route
router.post('/:routeId/like/:userId', async (req: Request, res: Response) => {
	try {
		const route = await routeService.likeRoute(
			req.params.routeId,
			req.params.userId
		)
		res.json(route)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

/**
 * @swagger
 * /routes/{routeId}/like/{userId}:
 *   delete:
 *     summary: Unlike a route
 *     tags: [Routes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the route to unlike
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user unliking the route
 *     responses:
 *       200:
 *         description: Route unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Route'
 *       400:
 *         description: Invalid request or route not liked
 *       404:
 *         description: Route not found
 */

// Unlike route
router.delete('/:routeId/like/:userId', async (req: Request, res: Response) => {
	try {
		const route = await routeService.unlikeRoute(
			req.params.routeId,
			req.params.userId
		)
		res.json(route)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

/**
 * @swagger
 * /routes/{routeId}/comments:
 *   post:
 *     summary: Add a comment to a route
 *     tags: [Routes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the route to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - content
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user making the comment
 *               content:
 *                 type: string
 *                 description: Content of the comment
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Route'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Route not found
 */

// Add comment
router.post('/:routeId/comments', async (req: Request, res: Response) => {
	try {
		const { userId, content } = req.body
		const route = await routeService.addComment(
			req.params.routeId,
			userId,
			content
		)
		res.json(route)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

/**
 * @swagger
 * /routes/{routeId}/comments/{commentId}:
 *   delete:
 *     summary: Remove a comment from a route
 *     tags: [Routes]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the route
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to remove
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user removing the comment
 *     responses:
 *       200:
 *         description: Comment removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Route'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Route or comment not found
 */

// Remove comment
router.delete(
	'/:routeId/comments/:commentId',
	async (req: Request, res: Response) => {
		try {
			const { userId } = req.body
			const route = await routeService.removeComment(
				req.params.routeId,
				req.params.commentId,
				userId
			)
			res.json(route)
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'An unknown error occurred'
			res.status(400).json({ message: errorMessage })
		}
	}
)

/**
 * @swagger
 * /routes/user/{userId}:
 *   get:
 *     summary: Get routes by user
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of routes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Route'
 *                 total:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *       400:
 *         description: Invalid request
 */

// Get routes by user
router.get('/user/:userId', async (req: Request, res: Response) => {
	try {
		const page = parseInt(req.query.page as string) || 1
		const limit = parseInt(req.query.limit as string) || 10
		const routes = await routeService.getRoutesByUser(
			req.params.userId,
			page,
			limit
		)
		res.json(routes)
	} catch (error) {
		let errorMessage = 'An unknown error occurred'
		if (error instanceof Error) {
			if (error.name === 'CastError') {
				errorMessage = 'Invalid ID format'
			} else {
				errorMessage = error.message
			}
		}
		res.status(400).json({ message: errorMessage })
	}
})

/**
 * @swagger
 * /routes/search:
 *   get:
 *     summary: Search routes
 *     tags: [Routes]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Route'
 *                 total:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *       400:
 *         description: Invalid request
 */

// Search routes
router.get('/search', async (req: Request, res: Response) => {
	try {
		const query = req.query.q as string
		const page = parseInt(req.query.page as string) || 1
		const limit = parseInt(req.query.limit as string) || 10
		const routes = await routeService.searchRoutes(query, page, limit)
		res.json(routes)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

/**
 * @swagger
 * /routes/nearby:
 *   get:
 *     summary: Get nearby routes
 *     tags: [Routes]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude coordinate
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude coordinate
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 5000
 *         description: Search radius in meters
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of nearby routes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Route'
 *                 total:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *       400:
 *         description: Invalid request
 */

// Get nearby routes
router.get('/nearby', async (req: Request, res: Response) => {
	try {
		const lat = parseFloat(req.query.lat as string)
		const lng = parseFloat(req.query.lng as string)
		const radius = parseFloat(req.query.radius as string) || 10
		const page = parseInt(req.query.page as string) || 1
		const limit = parseInt(req.query.limit as string) || 10

		if (isNaN(lat) || isNaN(lng)) {
			return res.status(400).json({ message: 'Invalid coordinates' })
		}

		const routes = await routeService.getNearbyRoutes(
			lat,
			lng,
			radius,
			page,
			limit
		)
		res.json(routes)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

// Get all routes
router.get('/', async (req: Request, res: Response) => {
	try {
		const page = parseInt(req.query.page as string) || 1
		const limit = parseInt(req.query.limit as string) || 10
		const routes = await routeService.getPublicRoutes(page, limit)
		res.json(routes)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

/**
 * @swagger
 * /routes/find/{routeId}:
 *   get:
 *     summary: Get a route by ID
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the route to retrieve
 *     responses:
 *       200:
 *         description: Route found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Route'
 *       404:
 *         description: Route not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Route not found
 *       400:
 *         description: Invalid route ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid ID format
 */

// Get route by ID
router.get('/find/:routeId', async (req: Request, res: Response) => {
	try {
		const route = await routeService.getRoute(req.params.routeId)
		if (!route) {
			return res.status(404).json({ message: 'Route not found' })
		}
		res.json(route)
	} catch (error) {
		let errorMessage = 'An unknown error occurred'
		let statusCode = 400
		if (error instanceof Error) {
			if (error.message === 'Route not found') {
				statusCode = 404
				errorMessage = error.message
			} else if (
				error.name === 'CastError' ||
				error.message === 'Invalid ID format'
			) {
				errorMessage = 'Invalid ID format'
			} else {
				errorMessage = error.message
			}
		}
		res.status(statusCode).json({ message: errorMessage })
	}
})

export default router
