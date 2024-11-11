import { ConversationService } from '../../src/services/conversation-service'
import { User } from '../../src/models'
import { Types } from 'mongoose'
import { Conversation } from '../../src/models/conversation'
import { Message } from '../../src/models/message'

describe('ConversationService', () => {
	let conversationService: ConversationService
	let userId1: Types.ObjectId
	let userId2: Types.ObjectId

	beforeEach(async () => {
		conversationService = new ConversationService()

		// Create test users
		const user1 = await User.create({
			name: 'Test User 1',
			username: 'testuser1',
			email: 'test1@example.com',
			password: 'password123',
			bio: 'Test bio 1',
		})
		userId1 = user1._id as Types.ObjectId

		const user2 = await User.create({
			name: 'Test User 2',
			username: 'testuser2',
			email: 'test2@example.com',
			password: 'password123',
			bio: 'Test bio 2',
		})
		userId2 = user2._id as Types.ObjectId
	})

	describe('createConversation', () => {
		it('should create a new conversation successfully', async () => {
			const conversation = await conversationService.createConversation([
				userId1.toString(),
				userId2.toString(),
			])

			expect(conversation).toBeDefined()
			expect(conversation.participants).toHaveLength(2)
			expect(conversation.participants.map((p) => p._id.toString())).toContain(
				userId1.toString()
			)
			expect(conversation.participants.map((p) => p._id.toString())).toContain(
				userId2.toString()
			)
		})

		it('should return existing conversation if one exists between participants', async () => {
			// Create first conversation
			const conversation1 = await conversationService.createConversation([
				userId1.toString(),
				userId2.toString(),
			])

			// Try to create second conversation with same participants
			const conversation2 = await conversationService.createConversation([
				userId2.toString(),
				userId1.toString(),
			])

			expect((conversation2 as { _id: Types.ObjectId })._id.toString()).toBe(
				(conversation1 as { _id: Types.ObjectId })._id.toString()
			)
		})

		it('should throw error when less than 2 participants', async () => {
			await expect(
				conversationService.createConversation([userId1.toString()])
			).rejects.toThrow('Conversation must have at least 2 participants')
		})

		it('should throw error for invalid participant ID format', async () => {
			const invalidId = 'invalid-id'

			await expect(
				conversationService.createConversation([userId1.toString(), invalidId])
			).rejects.toThrow('Invalid participant ID format')
		})
	})

	describe('getConversationsByUserId', () => {
		beforeEach(async () => {
			// Clear any existing conversations
			await Conversation.deleteMany({})

			// Create multiple conversations for testing pagination
			const promises = Array.from({ length: 25 }, () =>
				Conversation.create({
					participants: [userId1, userId2],
				})
			)
			await Promise.all(promises)
		})

		it('should get conversations for a user with default pagination', async () => {
			const result = await conversationService.getConversationsByUserId(
				userId1.toString()
			)

			expect(result.data).toHaveLength(20) // Default limit
			expect(result.total).toBe(25)
			expect(result.pages).toBe(2)
			result.data.forEach((conversation) => {
				expect(
					conversation.participants.map((p) => p._id.toString())
				).toContain(userId1.toString())
			})
		})

		it('should get conversations with custom pagination', async () => {
			const result = await conversationService.getConversationsByUserId(
				userId1.toString(),
				2,
				10
			)

			expect(result.data).toHaveLength(10)
			expect(result.total).toBe(25)
			expect(result.pages).toBe(3)
		})

		it('should return empty array when user has no conversations', async () => {
			const nonExistentUserId = new Types.ObjectId()
			const result = await conversationService.getConversationsByUserId(
				nonExistentUserId.toString()
			)

			expect(result.data).toHaveLength(0)
			expect(result.total).toBe(0)
			expect(result.pages).toBe(0)
		})

		it('should throw error for invalid user ID format', async () => {
			const invalidId = 'invalid-id'

			await expect(
				conversationService.getConversationsByUserId(invalidId)
			).rejects.toThrow('Invalid user ID format')
		})

		afterEach(async () => {
			await Conversation.deleteMany({})
		})
	})

	describe('updateLastMessage', () => {
		let messageId: Types.ObjectId
		let conversationId: Types.ObjectId

		beforeEach(async () => {
			// Create a test conversation
			const conversation = await Conversation.create({
				participants: [userId1, userId2],
			})
			conversationId = conversation._id as Types.ObjectId

			// Create a test message
			const message = await Message.create({
				conversation: conversationId,
				sender: userId1,
				content: 'Test message content',
				readBy: [userId1],
			})
			messageId = message._id as Types.ObjectId
		})

		it('should update last message successfully', async () => {
			const updatedConversation = await conversationService.updateLastMessage(
				conversationId.toString(),
				messageId.toString()
			)

			expect(updatedConversation).toBeDefined()
			expect(updatedConversation.lastMessage?._id.toString()).toBe(
				messageId.toString()
			)

			// Verify in database
			const savedConversation = await Conversation.findById(conversationId)
			expect(savedConversation?.lastMessage?._id.toString()).toBe(
				messageId.toString()
			)
		})

		it('should throw error for invalid conversation ID format', async () => {
			const invalidId = 'invalid-id'

			await expect(
				conversationService.updateLastMessage(invalidId, messageId.toString())
			).rejects.toThrow('Invalid ID format')
		})

		it('should throw error for invalid message ID format', async () => {
			const invalidId = 'invalid-id'

			await expect(
				conversationService.updateLastMessage(
					conversationId.toString(),
					invalidId
				)
			).rejects.toThrow('Invalid ID format')
		})

		it('should throw error when conversation does not exist', async () => {
			const nonExistentId = new Types.ObjectId().toString()

			await expect(
				conversationService.updateLastMessage(
					nonExistentId,
					messageId.toString()
				)
			).rejects.toThrow('Conversation not found')
		})

		afterEach(async () => {
			await Message.deleteMany({})
			await Conversation.deleteMany({})
		})
	})

	afterEach(async () => {
		await User.deleteMany({})
	})
})
