import { ConversationService } from '../../src/services/conversation-service'
import { User } from '../../src/models'
import { Types } from 'mongoose'

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

	afterEach(async () => {
		await User.deleteMany({})
	})
})
