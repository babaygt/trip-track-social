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

	describe('unlikeRoute', () => {
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

			// Like the route first to set up for unliking
			await routeService.likeRoute(routeId, userId.toString())
		})

		it('should successfully unlike a route', async () => {
			const unlikedRoute = await routeService.unlikeRoute(
				routeId,
				userId.toString()
			)

			expect(unlikedRoute).toBeDefined()
			expect(unlikedRoute.likes).toHaveLength(0) // Assuming the user is the only one who liked it
		})

		it('should throw error when route is not liked by the user', async () => {
			// Create a new user and try to unlike the route
			const anotherUserId = new Types.ObjectId()

			await expect(
				routeService.unlikeRoute(routeId, anotherUserId.toString())
			).rejects.toThrow('Route not liked')
		})

		it('should throw error when route does not exist', async () => {
			const nonExistentRouteId = new Types.ObjectId().toString()

			await expect(
				routeService.unlikeRoute(nonExistentRouteId, userId.toString())
			).rejects.toThrow('Route not found')
		})
	})

	describe('addComment', () => {
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

		it('should successfully add a comment to a route', async () => {
			const commentContent = 'This is a test comment'
			const updatedRoute = await routeService.addComment(
				routeId,
				userId.toString(),
				commentContent
			)

			expect(updatedRoute).toBeDefined()
			expect(updatedRoute.comments).toHaveLength(1)
			expect(updatedRoute.comments[0].content).toBe(commentContent)
			expect(updatedRoute.comments[0].user._id.toString()).toBe(
				userId.toString()
			)
		})

		it('should throw an error when trying to add a comment to a non-existent route', async () => {
			const nonExistentRouteId = new Types.ObjectId().toString()
			const commentContent = 'This comment should not be added'

			await expect(
				routeService.addComment(
					nonExistentRouteId,
					userId.toString(),
					commentContent
				)
			).rejects.toThrow('Route not found')
		})
	})

	describe('removeComment', () => {
		let routeId: string
		let commentId: string

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

			// Add a comment to the route
			const updatedRoute = (await routeService.addComment(
				routeId,
				userId.toString(),
				'This is a test comment'
			)) as { comments: { _id: Types.ObjectId }[] }
			commentId = updatedRoute.comments[0]._id.toString()
		})

		it('should successfully remove a comment from a route', async () => {
			const updatedRoute = await routeService.removeComment(
				routeId,
				commentId,
				userId.toString()
			)

			expect(updatedRoute).toBeDefined()
			expect(updatedRoute.comments).toHaveLength(0)
		})

		it('should throw an error when trying to remove a non-existent comment', async () => {
			const nonExistentCommentId = new Types.ObjectId().toString()

			await expect(
				routeService.removeComment(
					routeId,
					nonExistentCommentId,
					userId.toString()
				)
			).rejects.toThrow('Comment not found')
		})

		it('should throw an error when user is not authorized to remove the comment', async () => {
			// Create a new user
			const anotherUserId = new Types.ObjectId().toString()

			await expect(
				routeService.removeComment(routeId, commentId, anotherUserId)
			).rejects.toThrow('Not authorized to remove this comment')
		})
	})

	describe('getRoutesByUser', () => {
		let routeId: string

		beforeEach(async () => {
			// Create a test route
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

		it('should return routes for a given user', async () => {
			const routes = await routeService.getRoutesByUser(userId.toString())

			expect(routes).toBeDefined()
			expect((routes.data as { _id: Types.ObjectId }[]).length).toBe(1)
			expect((routes.data as { _id: Types.ObjectId }[])[0]._id.toString()).toBe(
				routeId.toString()
			)
			expect(
				(
					routes.data as { creator: { _id: Types.ObjectId } }[]
				)[0].creator._id.toString()
			).toBe(userId.toString())
		})

		it('should return an empty array if user has no routes', async () => {
			const anotherUserId = new Types.ObjectId().toString()
			const routes = await routeService.getRoutesByUser(anotherUserId)

			expect(routes).toBeDefined()
			expect(routes.data).toHaveLength(0)
		})

		it('should paginate results', async () => {
			// Create additional routes for pagination
			await routeService.createRoute({
				title: 'Another Test Route',
				creator: userId,
				startPoint: { lat: 2, lng: 2 },
				endPoint: { lat: 3, lng: 3 },
				travelMode: 'WALKING' as TravelMode,
				description: 'Another test description',
				totalDistance: 200,
				totalTime: 7200,
			})

			const routesPage1 = await routeService.getRoutesByUser(
				userId.toString(),
				1,
				1
			)
			const routesPage2 = await routeService.getRoutesByUser(
				userId.toString(),
				2,
				1
			)

			expect(routesPage1.data).toHaveLength(1)
			expect(routesPage2.data).toHaveLength(1)
			expect(
				(routesPage1.data as { _id: Types.ObjectId }[])[0]._id.toString()
			).not.toBe(
				(routesPage2.data as { _id: Types.ObjectId }[])[0]._id.toString()
			)
		})
	})
})
