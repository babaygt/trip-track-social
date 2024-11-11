import request from 'supertest'
import app from '../../src/app'
import { User, Conversation, IConversation } from '../../src/models'
import { Types } from 'mongoose'

describe('Conversation Routes', () => {
	describe('POST /conversations', () => {
		let userId1: Types.ObjectId
		let userId2: Types.ObjectId

		beforeEach(async () => {
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

		it('should create a new conversation successfully', async () => {
			const participantIds = [userId1.toString(), userId2.toString()]

			const response = await request(app)
				.post('/conversations')
				.send({ participantIds })
				.expect(201)

			expect(response.body).toHaveProperty('_id')
			expect(response.body.participants).toHaveLength(2)
			expect(
				response.body.participants.map((p: { _id: Types.ObjectId }) =>
					p._id.toString()
				)
			).toContain(userId1.toString())
			expect(
				response.body.participants.map((p: { _id: Types.ObjectId }) =>
					p._id.toString()
				)
			).toContain(userId2.toString())

			// Verify conversation was actually saved in database
			const savedConversation = await Conversation.findById(response.body._id)
			expect(savedConversation).toBeTruthy()
			expect(savedConversation?.participants).toHaveLength(2)
		})

		it('should return existing conversation if one exists', async () => {
			const participantIds = [userId1.toString(), userId2.toString()]

			// Create first conversation
			const response1 = await request(app)
				.post('/conversations')
				.send({ participantIds })
				.expect(201)

			// Try to create second conversation with same participants
			const response2 = await request(app)
				.post('/conversations')
				.send({ participantIds: participantIds.reverse() })
				.expect(201)

			expect(response2.body._id).toBe(response1.body._id)
		})

		it('should return 400 when less than 2 participants', async () => {
			const response = await request(app)
				.post('/conversations')
				.send({ participantIds: [userId1.toString()] })
				.expect(400)

			expect(response.body).toEqual({
				message: 'Conversation must have at least 2 participants',
			})
		})

		it('should return 400 for invalid participant ID format', async () => {
			const response = await request(app)
				.post('/conversations')
				.send({ participantIds: [userId1.toString(), 'invalid-id'] })
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid participant ID format',
			})
		})

		afterEach(async () => {
			await User.deleteMany({})
			await Conversation.deleteMany({})
		})
	})

	describe('GET /conversations/user/:userId', () => {
		let userId1: Types.ObjectId
		let userId2: Types.ObjectId

		beforeEach(async () => {
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

			// Create multiple conversations for testing pagination
			const promises = Array.from({ length: 25 }, () =>
				Conversation.create({
					participants: [userId1, userId2],
				})
			)
			await Promise.all(promises)
		})

		it('should get conversations with default pagination', async () => {
			const response = await request(app)
				.get(`/conversations/user/${userId1}`)
				.expect(200)

			expect(response.body.data).toHaveLength(20) // Default limit
			expect(response.body.total).toBe(25)
			expect(response.body.pages).toBe(2)
			response.body.data.forEach((conversation: IConversation) => {
				expect(
					conversation.participants.map((p: { _id: Types.ObjectId }) =>
						p._id.toString()
					)
				).toContain(userId1.toString())
			})
		})

		it('should get conversations with custom pagination', async () => {
			const response = await request(app)
				.get(`/conversations/user/${userId1}`)
				.query({ page: 2, limit: 10 })
				.expect(200)

			expect(response.body.data).toHaveLength(10)
			expect(response.body.total).toBe(25)
			expect(response.body.pages).toBe(3)
		})

		it('should return empty array when user has no conversations', async () => {
			const nonExistentUserId = new Types.ObjectId()
			const response = await request(app)
				.get(`/conversations/user/${nonExistentUserId}`)
				.expect(200)

			expect(response.body.data).toHaveLength(0)
			expect(response.body.total).toBe(0)
			expect(response.body.pages).toBe(0)
		})

		it('should return 400 for invalid user ID format', async () => {
			const response = await request(app)
				.get('/conversations/user/invalid-id')
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid user ID format',
			})
		})

		afterEach(async () => {
			await User.deleteMany({})
			await Conversation.deleteMany({})
		})
	})
})
