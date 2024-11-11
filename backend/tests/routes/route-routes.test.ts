import request from 'supertest'
import app from '../../src/app'
import { Route, User } from '../../src/models'
import { Types } from 'mongoose'
import { TravelMode } from '../../src/models/route'

describe('Route Routes', () => {
	describe('POST /routes', () => {
		let userId: Types.ObjectId

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
		})

		const validRouteData = {
			title: 'Test Route',
			creator: undefined as unknown as Types.ObjectId, // Will be set in beforeEach
			startPoint: { lat: 0, lng: 0 },
			endPoint: { lat: 1, lng: 1 },
			travelMode: 'DRIVING' as TravelMode,
			description: 'Test description',
			totalDistance: 100,
			totalTime: 3600,
			visibility: 'public' as const,
		}

		beforeEach(() => {
			validRouteData.creator = userId
		})

		it('should create a new route successfully', async () => {
			const response = await request(app)
				.post('/routes')
				.send(validRouteData)
				.expect(201)

			expect(response.body).toHaveProperty('_id')
			expect(response.body.title).toBe(validRouteData.title)
			expect(response.body.creator._id.toString()).toBe(userId.toString())
			expect(response.body.startPoint).toMatchObject(validRouteData.startPoint)
			expect(response.body.endPoint).toMatchObject(validRouteData.endPoint)
			expect(response.body.travelMode).toBe(validRouteData.travelMode)
			expect(response.body.description).toBe(validRouteData.description)
			expect(response.body.totalDistance).toBe(validRouteData.totalDistance)
			expect(response.body.totalTime).toBe(validRouteData.totalTime)
			expect(response.body.likes).toHaveLength(0)
			expect(response.body.comments).toHaveLength(0)

			// Verify route was actually saved in database
			const savedRoute = await Route.findById(response.body._id)
			expect(savedRoute).toBeTruthy()
			expect(savedRoute?.title).toBe(validRouteData.title)
		})

		it('should return 400 when required fields are missing', async () => {
			const invalidRouteData = {
				title: 'Test Route',
				// missing required fields
			}

			const response = await request(app)
				.post('/routes')
				.send(invalidRouteData)
				.expect(400)

			expect(response.body).toHaveProperty('message')
		})

		it('should return 400 for invalid coordinates', async () => {
			const invalidRouteData = {
				...validRouteData,
				startPoint: { lat: 91, lng: 0 }, // invalid latitude
			}

			const response = await request(app)
				.post('/routes')
				.send(invalidRouteData)
				.expect(400)

			expect(response.body).toHaveProperty('message')
		})

		it('should return 400 for invalid travel mode', async () => {
			const invalidRouteData = {
				...validRouteData,
				travelMode: 'INVALID_MODE',
			}

			const response = await request(app)
				.post('/routes')
				.send(invalidRouteData)
				.expect(400)

			expect(response.body).toHaveProperty('message')
		})

		afterEach(async () => {
			await Route.deleteMany({})
			await User.deleteMany({})
		})
	})

	describe('POST /routes/:routeId/like/:userId', () => {
		let routeId: string
		let userId: Types.ObjectId

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

			// Create a test route
			const route = await Route.create({
				title: 'Test Route',
				creator: new Types.ObjectId(),
				startPoint: { lat: 0, lng: 0 },
				endPoint: { lat: 1, lng: 1 },
				travelMode: 'DRIVING' as TravelMode,
				description: 'Test description',
				totalDistance: 100,
				totalTime: 3600,
			})
			routeId = (route._id as Types.ObjectId).toString()
		})

		it('should successfully like a route', async () => {
			const response = await request(app)
				.post(`/routes/${routeId}/like/${userId}`)
				.expect(200)

			expect(response.body.likes).toHaveLength(1)
			expect(response.body.likes[0]._id.toString()).toBe(userId.toString())

			// Verify in database
			const route = await Route.findById(routeId)
			expect(route?.likes).toHaveLength(1)
			expect(route?.likes[0]._id.toString()).toBe(userId.toString())
		})

		it('should return 400 when trying to like the same route twice', async () => {
			// First like
			await request(app).post(`/routes/${routeId}/like/${userId}`).expect(200)

			// Try to like again
			const response = await request(app)
				.post(`/routes/${routeId}/like/${userId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Route already liked',
			})
		})

		it('should return 400 when route does not exist', async () => {
			const nonExistentRouteId = new Types.ObjectId().toString()

			const response = await request(app)
				.post(`/routes/${nonExistentRouteId}/like/${userId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Route not found',
			})
		})

		it('should return 400 for invalid route ID format', async () => {
			const invalidRouteId = 'invalid-id'

			const response = await request(app)
				.post(`/routes/${invalidRouteId}/like/${userId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})

		afterEach(async () => {
			await Route.deleteMany({})
			await User.deleteMany({})
		})
	})

	describe('DELETE /routes/:routeId/like/:userId', () => {
		let routeId: string
		let userId: Types.ObjectId

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

			// Create a test route
			const route = await Route.create({
				title: 'Test Route',
				creator: new Types.ObjectId(),
				startPoint: { lat: 0, lng: 0 },
				endPoint: { lat: 1, lng: 1 },
				travelMode: 'DRIVING' as TravelMode,
				description: 'Test description',
				totalDistance: 100,
				totalTime: 3600,
			})
			routeId = (route._id as Types.ObjectId).toString()

			// Like the route first
			await Route.findByIdAndUpdate(routeId, {
				$push: { likes: userId },
			})
		})

		it('should successfully unlike a route', async () => {
			const response = await request(app)
				.delete(`/routes/${routeId}/like/${userId}`)
				.expect(200)

			expect(response.body.likes).toHaveLength(0)

			// Verify in database
			const route = await Route.findById(routeId)
			expect(route?.likes).toHaveLength(0)
		})

		it('should return 400 when trying to unlike a route that is not liked', async () => {
			// Create another user that hasn't liked the route
			const anotherUser = await User.create({
				name: 'Another User',
				username: 'anotheruser',
				email: 'another@example.com',
				password: 'password123',
				bio: 'Another bio',
			})

			const response = await request(app)
				.delete(`/routes/${routeId}/like/${anotherUser._id}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Route not liked',
			})
		})

		it('should return 400 when route does not exist', async () => {
			const nonExistentRouteId = new Types.ObjectId().toString()

			const response = await request(app)
				.delete(`/routes/${nonExistentRouteId}/like/${userId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Route not found',
			})
		})

		it('should return 400 for invalid route ID format', async () => {
			const invalidRouteId = 'invalid-id'

			const response = await request(app)
				.delete(`/routes/${invalidRouteId}/like/${userId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})

		afterEach(async () => {
			await Route.deleteMany({})
			await User.deleteMany({})
		})
	})

	describe('POST /routes/:routeId/comments', () => {
		let routeId: string
		let userId: Types.ObjectId

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

			// Create a test route
			const route = await Route.create({
				title: 'Test Route',
				creator: userId,
				startPoint: { lat: 0, lng: 0 },
				endPoint: { lat: 1, lng: 1 },
				travelMode: 'DRIVING',
				description: 'Test description',
				totalDistance: 100,
				totalTime: 3600,
			})
			routeId = (route._id as Types.ObjectId).toString()
		})

		it('should successfully add a comment to a route', async () => {
			const commentContent = 'This is a test comment'
			const response = await request(app)
				.post(`/routes/${routeId}/comments`)
				.send({ userId: userId.toString(), content: commentContent })
				.expect(200)

			expect(response.body).toBeDefined()
			expect(response.body.comments).toHaveLength(1)
			expect(response.body.comments[0].content).toBe(commentContent)
			expect(response.body.comments[0].user._id.toString()).toBe(
				userId.toString()
			)

			// Verify in database
			const route = await Route.findById(routeId)
			expect(route?.comments).toHaveLength(1)
			expect(route?.comments[0].content).toBe(commentContent)
		})

		it('should return 400 when trying to add a comment to a non-existent route', async () => {
			const nonExistentRouteId = new Types.ObjectId().toString()
			const commentContent = 'This comment should not be added'

			const response = await request(app)
				.post(`/routes/${nonExistentRouteId}/comments`)
				.send({ userId: userId.toString(), content: commentContent })
				.expect(400)

			expect(response.body).toEqual({
				message: 'Route not found',
			})
		})

		it('should return 400 for invalid route ID format', async () => {
			const invalidRouteId = 'invalid-id'
			const commentContent = 'This comment should not be added'

			const response = await request(app)
				.post(`/routes/${invalidRouteId}/comments`)
				.send({ userId: userId.toString(), content: commentContent })
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})

		afterEach(async () => {
			await Route.deleteMany({})
			await User.deleteMany({})
		})
	})

	describe('DELETE /routes/:routeId/comments/:commentId', () => {
		let routeId: string
		let userId: Types.ObjectId
		let commentId: string

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

			// Create a test route
			const route = await Route.create({
				title: 'Test Route',
				creator: userId,
				startPoint: { lat: 0, lng: 0 },
				endPoint: { lat: 1, lng: 1 },
				travelMode: 'DRIVING',
				description: 'Test description',
				totalDistance: 100,
				totalTime: 3600,
				comments: [
					{
						content: 'This is a test comment',
						user: userId,
					},
				],
			})
			routeId = (route._id as Types.ObjectId).toString()
			commentId = (route.comments[0]._id as Types.ObjectId).toString()
		})

		it('should successfully remove a comment from a route', async () => {
			const response = await request(app)
				.delete(`/routes/${routeId}/comments/${commentId}`)
				.send({ userId: userId.toString() })
				.expect(200)

			expect(response.body).toBeDefined()
			expect(response.body.comments).toHaveLength(0)

			// Verify in database
			const route = await Route.findById(routeId)
			expect(route?.comments).toHaveLength(0)
		})

		it('should return 400 when trying to remove a non-existent comment', async () => {
			const nonExistentCommentId = new Types.ObjectId().toString()

			const response = await request(app)
				.delete(`/routes/${routeId}/comments/${nonExistentCommentId}`)
				.send({ userId: userId.toString() })
				.expect(400)

			expect(response.body).toEqual({
				message: 'Comment not found',
			})
		})

		it('should return 400 when user is not authorized to remove the comment', async () => {
			// Create another user
			const anotherUser = await User.create({
				name: 'Another User',
				username: 'anotheruser',
				email: 'another@example.com',
				password: 'password123',
				bio: 'Another bio',
			})

			const response = await request(app)
				.delete(`/routes/${routeId}/comments/${commentId}`)
				.send({ userId: (anotherUser._id as Types.ObjectId).toString() })
				.expect(400)

			expect(response.body).toEqual({
				message: 'Not authorized to remove this comment',
			})
		})

		it('should return 400 when route does not exist', async () => {
			const nonExistentRouteId = new Types.ObjectId().toString()

			const response = await request(app)
				.delete(`/routes/${nonExistentRouteId}/comments/${commentId}`)
				.send({ userId: userId.toString() })
				.expect(400)

			expect(response.body).toEqual({
				message: 'Route not found',
			})
		})

		it('should return 400 for invalid route ID format', async () => {
			const invalidRouteId = 'invalid-id'

			const response = await request(app)
				.delete(`/routes/${invalidRouteId}/comments/${commentId}`)
				.send({ userId: userId.toString() })
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})

		afterEach(async () => {
			await Route.deleteMany({})
			await User.deleteMany({})
		})
	})
})
