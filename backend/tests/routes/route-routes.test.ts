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
})
