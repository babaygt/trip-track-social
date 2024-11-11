import express, { Request, Response, Router } from 'express'
import { MessageService } from '../services/message-service'

const router: Router = express.Router()
const messageService = new MessageService()

// Create message
router.post('/', async (req: Request, res: Response) => {
	try {
		const { conversationId, senderId, content } = req.body
		const message = await messageService.createMessage(
			conversationId,
			senderId,
			content
		)
		res.status(201).json(message)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

export default router
