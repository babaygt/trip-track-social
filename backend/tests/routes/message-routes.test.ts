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

	describe('PUT /messages/:messageId/read/:userId', () => {
		let userId: Types.ObjectId
		let conversationId: Types.ObjectId
		let messageId: string

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
				participants: [userId, new Types.ObjectId()],
			})
			conversationId = conversation._id as Types.ObjectId

			// Create a test message
			const message = await Message.create({
				conversation: conversationId,
				sender: userId,
				content: 'Test message content',
				readBy: [userId], // Message is read by sender initially
			})
			messageId = message._id as string
		})

		it('should successfully mark a message as read', async () => {
			// Create another user to mark message as read
			const anotherUser = await User.create({
				name: 'Another User',
				username: 'anotheruser',
				email: 'another@example.com',
				password: 'password123',
				bio: 'Another bio',
			})

			const response = await request(app)
				.put(`/messages/${messageId}/read/${anotherUser._id}`)
				.expect(200)

			expect(response.body.readBy).toHaveLength(2)
			expect(
				response.body.readBy.map((reader: { _id: Types.ObjectId }) =>
					reader._id.toString()
				)
			).toContain((anotherUser as { _id: Types.ObjectId })._id.toString())

			// Verify in database
			const updatedMessage = await Message.findById(messageId)
			expect(updatedMessage?.readBy).toHaveLength(2)
			expect(
				updatedMessage?.readBy.map((reader) => reader._id.toString())
			).toContain((anotherUser as { _id: Types.ObjectId })._id.toString())
		})

		it('should return 400 for invalid message ID format', async () => {
			const response = await request(app)
				.put(`/messages/invalid-id/read/${userId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})

		it('should return 400 for invalid user ID format', async () => {
			const response = await request(app)
				.put(`/messages/${messageId}/read/invalid-id`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})

		it('should return 400 when message does not exist', async () => {
			const nonExistentMessageId = new Types.ObjectId().toString()

			const response = await request(app)
				.put(`/messages/${nonExistentMessageId}/read/${userId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Message not found',
			})
		})

		afterEach(async () => {
			await User.deleteMany({})
			await Conversation.deleteMany({})
			await Message.deleteMany({})
		})
	})
})
