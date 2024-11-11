import request from 'supertest'
import app from '../../src/app'
import { User, Conversation, Message } from '../../src/models'
import { Types } from 'mongoose'

describe('Message Routes', () => {
	describe('POST /messages', () => {
		let userId: Types.ObjectId
		let conversationId: Types.ObjectId

		beforeEach(async () => {
			// Create a test user
			const user = await User.create({
				name: 'Test User',
				username: 'testuser',
				email: 'test@example.com',
				password: 'password123',
				bio: 'Test bio',
			})
			userId = user._id as Types.ObjectId

			// Create a test conversation
			const conversation = await Conversation.create({
				participants: [userId, new Types.ObjectId()], // Add another participant to meet minimum requirement
			})
			conversationId = conversation._id as Types.ObjectId
		})

		it('should create a new message successfully', async () => {
			const messageData = {
				conversationId: conversationId.toString(),
				senderId: userId.toString(),
				content: 'Test message content',
			}

			const response = await request(app)
				.post('/messages')
				.send(messageData)
				.expect(201)

			expect(response.body).toHaveProperty('_id')
			expect(response.body.content).toBe(messageData.content)
			expect(response.body.sender._id.toString()).toBe(messageData.senderId)
			expect(response.body.conversation.toString()).toBe(
				messageData.conversationId
			)
			expect(response.body.readBy).toHaveLength(1)
			expect(response.body.readBy[0]._id.toString()).toBe(messageData.senderId)

			// Verify message was actually saved in database
			const savedMessage = await Message.findById(response.body._id)
			expect(savedMessage).toBeTruthy()
			expect(savedMessage?.content).toBe(messageData.content)
		})

		it('should return 400 when conversation ID is invalid', async () => {
			const messageData = {
				conversationId: 'invalid-id',
				senderId: userId.toString(),
				content: 'Test message content',
			}

			const response = await request(app)
				.post('/messages')
				.send(messageData)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})

		it('should return 400 when sender ID is invalid', async () => {
			const messageData = {
				conversationId: conversationId.toString(),
				senderId: 'invalid-id',
				content: 'Test message content',
			}

			const response = await request(app)
				.post('/messages')
				.send(messageData)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})

		it('should return 400 when required fields are missing', async () => {
			const messageData = {
				// Missing required fields
				content: 'Test message content',
			}

			const response = await request(app)
				.post('/messages')
				.send(messageData)
				.expect(400)

			expect(response.body).toHaveProperty('message')
		})

		afterEach(async () => {
			await User.deleteMany({})
			await Conversation.deleteMany({})
			await Message.deleteMany({})
		})
	})
})
