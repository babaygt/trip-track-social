import express, { Request, Response, Router } from 'express'
import { ConversationService } from '../services/conversation-service'

const router: Router = express.Router()
const conversationService = new ConversationService()

/**
 * @swagger
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the conversation
 *         participants:
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
 *               profilePicture:
 *                 type: string
 *           description: Array of users participating in the conversation
 *         lastMessage:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             content:
 *               type: string
 *             sender:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *             createdAt:
 *               type: string
 *               format: date-time
 *           description: The most recent message in the conversation
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - participants
 */

/**
 * @swagger
 * /conversations:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Conversations]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participantIds
 *             properties:
 *               participantIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 2
 *                 description: Array of user IDs participating in the conversation
 *     responses:
 *       201:
 *         description: Conversation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       400:
 *         description: Invalid input or insufficient participants
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /conversations/user/{userId}:
 *   get:
 *     summary: Get conversations for a user
 *     tags: [Conversations]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of conversations per page
 *     responses:
 *       200:
 *         description: List of conversations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Conversation'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *       400:
 *         description: Invalid request
 *       404:
 *         description: User not found
 */
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
