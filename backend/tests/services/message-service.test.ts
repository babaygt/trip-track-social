import { MessageService } from '../../src/services/message-service'
import { User, Conversation } from '../../src/models'
import { Types } from 'mongoose'

describe('MessageService', () => {
	let messageService: MessageService
	let userId: Types.ObjectId
	let conversationId: Types.ObjectId

	beforeEach(async () => {
		messageService = new MessageService()

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

	describe('createMessage', () => {
		it('should create a new message successfully', async () => {
			const content = 'Test message content'

			const message = await messageService.createMessage(
				conversationId.toString(),
				userId.toString(),
				content
			)

			expect(message).toBeDefined()
			expect(message.content).toBe(content)
			expect(message.sender._id.toString()).toBe(userId.toString())
			expect(message.conversation.toString()).toBe(conversationId.toString())
			expect(message.readBy).toHaveLength(1)
			expect(message.readBy[0]._id.toString()).toBe(userId.toString())
		})

		it('should throw error for invalid conversation ID format', async () => {
			const invalidId = 'invalid-id'
			const content = 'Test message content'

			await expect(
				messageService.createMessage(invalidId, userId.toString(), content)
			).rejects.toThrow('Invalid ID format')
		})

		it('should throw error for invalid sender ID format', async () => {
			const invalidId = 'invalid-id'
			const content = 'Test message content'

			await expect(
				messageService.createMessage(
					conversationId.toString(),
					invalidId,
					content
				)
			).rejects.toThrow('Invalid ID format')
		})
	})

	afterEach(async () => {
		await User.deleteMany({})
		await Conversation.deleteMany({})
	})
})
