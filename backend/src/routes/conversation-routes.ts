import express, { Request, Response, Router } from 'express'
import { ConversationService } from '../services/conversation-service'

const router: Router = express.Router()
const conversationService = new ConversationService()

// Create conversation
router.post('/', async (req: Request, res: Response) => {
	try {
		const { participantIds } = req.body
		const conversation = await conversationService.createConversation(
			participantIds
		)
		res.status(201).json(conversation)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

// Get user conversations
router.get('/user/:userId', async (req: Request, res: Response) => {
	try {
		const page = parseInt(req.query.page as string) || 1
		const limit = parseInt(req.query.limit as string) || 20
		const conversations = await conversationService.getConversationsByUserId(
			req.params.userId,
			page,
			limit
		)
		res.json(conversations)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

export default router
