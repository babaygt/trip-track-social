import express, { Request, Response, Router } from 'express'
import { MessageService } from '../services/message-service'

const router: Router = express.Router()
const messageService = new MessageService()

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the message
 *         sender:
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
 *         content:
 *           type: string
 *           description: The content of the message
 *         conversation:
 *           type: string
 *           description: ID of the conversation this message belongs to
 *         readBy:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - sender
 *         - content
 *         - conversation
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *               - senderId
 *               - content
 *             properties:
 *               conversationId:
 *                 type: string
 *                 description: ID of the conversation
 *               senderId:
 *                 type: string
 *                 description: ID of the user sending the message
 *               content:
 *                 type: string
 *                 description: Content of the message
 *     responses:
 *       201:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /messages/{messageId}/read/{userId}:
 *   put:
 *     summary: Mark a message as read by a user
 *     tags: [Messages]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to mark as read
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user who read the message
 *     responses:
 *       200:
 *         description: Message marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Message not found
 */
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

/**
 * @swagger
 * /messages/conversation/{conversationId}:
 *   get:
 *     summary: Get messages from a conversation
 *     tags: [Messages]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation
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
 *           default: 50
 *         description: Number of messages per page
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *                 total:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Conversation not found
 */
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
