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

export default router
