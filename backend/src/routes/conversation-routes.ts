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

export default router
