import express, { Request, Response, Router } from 'express'
import { RouteService } from '../services/route-service'

const router: Router = express.Router()
const routeService = new RouteService()

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

export default router
