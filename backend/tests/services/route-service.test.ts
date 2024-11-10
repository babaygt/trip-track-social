import { RouteService } from '../../src/services/route-service'
import { Types } from 'mongoose'
import { TravelMode } from '../../src/models/route'
import { User } from '../../src/models'

describe('RouteService', () => {
	let routeService: RouteService
	let userId: Types.ObjectId

	beforeEach(async () => {
		routeService = new RouteService()
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

	describe('createRoute', () => {
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
			const route = await routeService.createRoute(validRouteData)

			expect(route).toBeDefined()
			expect(route.title).toBe(validRouteData.title)
			expect(route.creator._id.toString()).toBe(userId.toString())

			// Convert to plain object to avoid Mongoose-specific issues
			const routeObj = route.toObject()

			// Use toMatchObject for partial matching
			expect(routeObj.startPoint).toMatchObject(validRouteData.startPoint)
			expect(routeObj.endPoint).toMatchObject(validRouteData.endPoint)
			expect(routeObj.travelMode).toBe(validRouteData.travelMode)
			expect(routeObj.description).toBe(validRouteData.description)
			expect(routeObj.totalDistance).toBe(validRouteData.totalDistance)
			expect(routeObj.totalTime).toBe(validRouteData.totalTime)
			expect(routeObj.likes).toHaveLength(0)
			expect(routeObj.comments).toHaveLength(0)
		})

		it('should throw error when required fields are missing', async () => {
			const invalidRouteData = {
				title: 'Test Route',
				// missing required fields
			}

			await expect(routeService.createRoute(invalidRouteData)).rejects.toThrow()
		})

		it('should create route with default values for optional fields', async () => {
			const minimalRouteData = {
				title: 'Test Route',
				creator: userId,
				startPoint: { lat: 0, lng: 0 },
				endPoint: { lat: 1, lng: 1 },
				travelMode: 'DRIVING' as TravelMode,
				description: 'Test description',
				totalDistance: 100,
				totalTime: 3600,
			}

			const route = await routeService.createRoute(minimalRouteData)

			expect(route).toBeDefined()
			expect(route.visibility).toBe('public')

			const routeObj = route.toObject()
			expect(routeObj.likes).toHaveLength(0)
			expect(routeObj.comments).toHaveLength(0)
			expect(routeObj.tags).toHaveLength(0)
		})

		it('should throw error for invalid coordinates', async () => {
			const invalidRouteData = {
				...validRouteData,
				startPoint: { lat: 91, lng: 0 }, // invalid latitude
			}

			await expect(routeService.createRoute(invalidRouteData)).rejects.toThrow()
		})

		it('should throw error for invalid travel mode', async () => {
			const invalidRouteData = {
				...validRouteData,
				travelMode: 'INVALID_MODE' as TravelMode,
			}

			await expect(routeService.createRoute(invalidRouteData)).rejects.toThrow()
		})
	})

	describe('likeRoute', () => {
		let routeId: string

		beforeEach(async () => {
			// Create a test route first
			const route = await routeService.createRoute({
				title: 'Test Route',
				creator: userId,
				startPoint: { lat: 0, lng: 0 },
				endPoint: { lat: 1, lng: 1 },
				travelMode: 'DRIVING' as TravelMode,
				description: 'Test description',
				totalDistance: 100,
				totalTime: 3600,
			})
			routeId = route._id as string
		})

		it('should successfully like a route', async () => {
			const likedRoute = await routeService.likeRoute(
				routeId,
				userId.toString()
			)

			expect(likedRoute).toBeDefined()
			expect(likedRoute.likes).toHaveLength(1)
			expect(likedRoute.likes[0]._id.toString()).toBe(userId.toString())
		})

		it('should throw error when route is already liked', async () => {
			// Like the route first
			await routeService.likeRoute(routeId, userId.toString())

			// Try to like again
			await expect(
				routeService.likeRoute(routeId, userId.toString())
			).rejects.toThrow('Route already liked')
		})

		it('should throw error when route does not exist', async () => {
			const nonExistentRouteId = new Types.ObjectId().toString()

			await expect(
				routeService.likeRoute(nonExistentRouteId, userId.toString())
			).rejects.toThrow('Route not found')
		})
	})
})
