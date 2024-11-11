import request from 'supertest'
import app from '../../src/app'
import { User, Conversation } from '../../src/models'
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
})
