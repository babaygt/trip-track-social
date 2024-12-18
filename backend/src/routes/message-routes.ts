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

// Mark message as read
router.put('/:messageId/read/:userId', async (req: Request, res: Response) => {
	try {
		const message = await messageService.markAsRead(
			req.params.messageId,
			req.params.userId
		)
		res.json(message)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred'
		res.status(400).json({ message: errorMessage })
	}
})

// Get messages by conversation
router.get(
	'/conversation/:conversationId',
	async (req: Request, res: Response) => {
		try {
			const page = parseInt(req.query.page as string) || 1
			const limit = parseInt(req.query.limit as string) || 50
			const messages = await messageService.getMessagesByConversation(
				req.params.conversationId,
				page,
				limit
			)
			res.json(messages)
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'An unknown error occurred'
			res.status(400).json({ message: errorMessage })
		}
	}
)

export default router
