import { RouteService } from '../../src/services/route-service'
import { Types } from 'mongoose'
import { Route, TravelMode } from '../../src/models/route'
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

	describe('searchRoutes', () => {
		beforeEach(async () => {
			// Create some test routes
			await routeService.createRoute({
				title: 'Test Route 1',
				creator: userId,
				startPoint: { lat: 0, lng: 0 },
				endPoint: { lat: 1, lng: 1 },
				travelMode: 'DRIVING' as TravelMode,
				description: 'A scenic route',
				totalDistance: 100,
				totalTime: 3600,
				tags: ['scenic', 'nature'],
			})

			await routeService.createRoute({
				title: 'Test Route 2',
				creator: userId,
				startPoint: { lat: 2, lng: 2 },
				endPoint: { lat: 3, lng: 3 },
				travelMode: 'WALKING' as TravelMode,
				description: 'A city route',
				totalDistance: 200,
				totalTime: 7200,
				tags: ['city', 'urban'],
			})
		})

		it('should return routes matching the title', async () => {
			const routes = await routeService.searchRoutes('Test Route 1')

			expect(routes).toBeDefined()
			expect(routes.data).toHaveLength(1)
			expect(routes.data[0].title).toBe('Test Route 1')
		})

		it('should return routes matching the description', async () => {
			const routes = await routeService.searchRoutes('scenic')

			expect(routes).toBeDefined()
			expect(routes.data).toHaveLength(1)
			expect(routes.data[0].description).toContain('scenic')
		})

		it('should return routes matching the tags', async () => {
			const routes = await routeService.searchRoutes('urban')

			expect(routes).toBeDefined()
			expect(routes.data).toHaveLength(1)
			expect(routes.data[0].tags).toContain('urban')
		})

		it('should return an empty array if no routes match', async () => {
			const routes = await routeService.searchRoutes('nonexistent')

			expect(routes).toBeDefined()
			expect(routes.data).toHaveLength(0)
		})

		it('should paginate results', async () => {
			// Create additional routes for pagination
			await routeService.createRoute({
				title: 'Another Test Route',
				creator: userId,
				startPoint: { lat: 4, lng: 4 },
				endPoint: { lat: 5, lng: 5 },
				travelMode: 'BICYCLING' as TravelMode,
				description: 'Another scenic route',
				totalDistance: 300,
				totalTime: 10800,
				tags: ['scenic', 'long'],
			})

			const routesPage1 = await routeService.searchRoutes('Test', 1, 1)
			const routesPage2 = await routeService.searchRoutes('Test', 2, 1)

			expect(routesPage1.data).toHaveLength(1)
			expect(routesPage2.data).toHaveLength(1)
			expect(
				(routesPage1.data as { _id: Types.ObjectId }[])[0]._id.toString()
			).not.toBe(
				(routesPage2.data as { _id: Types.ObjectId }[])[0]._id.toString()
			)
		})
	})

	describe('getNearbyRoutes', () => {
		beforeEach(async () => {
			// Create some test routes
			await routeService.createRoute({
				title: 'Nearby Route 1',
				creator: userId,
				startPoint: { lat: 0, lng: 0 },
				endPoint: { lat: 1, lng: 1 },
				travelMode: 'DRIVING' as TravelMode,
				description: 'A nearby route',
				totalDistance: 100,
				totalTime: 3600,
			})

			await routeService.createRoute({
				title: 'Far Route',
				creator: userId,
				startPoint: { lat: 50, lng: 50 },
				endPoint: { lat: 51, lng: 51 },
				travelMode: 'WALKING' as TravelMode,
				description: 'A far route',
				totalDistance: 200,
				totalTime: 7200,
			})
		})

		it('should return routes within the specified radius', async () => {
			const routes = await routeService.getNearbyRoutes(0, 0, 10)

			expect(routes).toBeDefined()
			expect(routes.data).toHaveLength(1)
			expect(routes.data[0].title).toBe('Nearby Route 1')
		})

		it('should return an empty array if no routes are within the specified radius', async () => {
			// Search at a valid location far from any existing routes
			const routes = await routeService.getNearbyRoutes(89, 180, 1)

			expect(routes).toBeDefined()
			expect(routes.data).toHaveLength(0)
		})

		it('should paginate results', async () => {
			// Create additional nearby routes for pagination
			await routeService.createRoute({
				title: 'Nearby Route 2',
				creator: userId,
				startPoint: { lat: 0.05, lng: 0.05 }, // Within ~7 km of (0,0)
				endPoint: { lat: 1.05, lng: 1.05 },
				travelMode: 'BICYCLING' as TravelMode,
				description: 'Another nearby route',
				totalDistance: 150,
				totalTime: 5400,
			})

			const routesPage1 = await routeService.getNearbyRoutes(0, 0, 10, 1, 1)
			const routesPage2 = await routeService.getNearbyRoutes(0, 0, 10, 2, 1)

			expect(routesPage1.data).toHaveLength(1)
			expect(routesPage2.data).toHaveLength(1)
			expect(
				(routesPage1.data as { _id: Types.ObjectId }[])[0]._id.toString()
			).not.toBe(
				(routesPage2.data as { _id: Types.ObjectId }[])[0]._id.toString()
			)
		})
	})

	describe('RouteService', () => {
		let routeService: RouteService
		let userId: Types.ObjectId

		describe('getRoutes', () => {
			beforeEach(async () => {
				// Clear the collections before each test
				await User.deleteMany({})
				await Route.deleteMany({})

				routeService = new RouteService()

				// Create a test user
				const user = await User.create({
					name: 'Test User',
					username: `testuser_${Date.now()}`, // Ensure unique username
					email: `testuser_${Date.now()}@example.com`, // Ensure unique email
					password: 'password123',
					bio: 'Test bio',
				})
				userId = user._id as Types.ObjectId

				// Create multiple test routes
				const routePromises = Array.from({ length: 25 }, (_, index) =>
					Route.create({
						title: `Test Route ${index + 1}`,
						creator: userId,
						startPoint: { lat: 0, lng: 0 },
						endPoint: { lat: 1, lng: 1 },
						travelMode: 'DRIVING' as TravelMode,
						description: `Test description ${index + 1}`,
						totalDistance: 100,
						totalTime: 3600,
						visibility: index < 20 ? 'public' : 'private', // Make some routes private
					})
				)
				await Promise.all(routePromises)
			})

			afterEach(async () => {
				// Clean up after each test
				await Route.deleteMany({})
				await User.deleteMany({})
			})

			it('should return public routes with default pagination', async () => {
				const result = await routeService.getRoutes(1, 10)

				// Optional: Log the result for debugging
				// console.log(result.data);

				expect(result.data).toHaveLength(10)
				expect(result.page).toBe(1)
				expect(result.limit).toBe(10)

				// Verify only public routes are returned
				result.data.forEach((route) => {
					expect(route.visibility).toBe('public')
				})

				// Verify creator population
				result.data.forEach((route) => {
					expect(route.creator).toHaveProperty('username')
					expect(route.creator).toHaveProperty('name')
					expect(route.creator).toHaveProperty('profilePicture')
				})
			})

			it('should return correct page of results', async () => {
				const page1 = await routeService.getRoutes(1, 5)
				const page2 = await routeService.getRoutes(2, 5)

				expect(page1.data).toHaveLength(5)
				expect(page2.data).toHaveLength(5)

				// Verify different routes are returned
				const page1Ids = page1.data.map((route) =>
					(route as { _id: Types.ObjectId })._id.toString()
				)
				const page2Ids = page2.data.map((route) =>
					(route as { _id: Types.ObjectId })._id.toString()
				)
				expect(page1Ids).not.toEqual(page2Ids)
			})

			it('should return empty array when page exceeds available routes', async () => {
				const result = await routeService.getRoutes(100, 10)

				expect(result.data).toHaveLength(0)
				expect(result.page).toBe(100)
				expect(result.limit).toBe(10)
			})

			it('should sort routes by createdAt in descending order', async () => {
				const result = await routeService.getRoutes(1, 10)

				const dates = result.data.map((route) =>
					new Date(route.createdAt).getTime()
				)
				const sortedDates = [...dates].sort((a, b) => b - a)

				expect(dates).toEqual(sortedDates)
			})
		})

		// Ensure global cleanup if necessary
		afterAll(async () => {
			await Route.deleteMany({})
			await User.deleteMany({})
		})
	})
})
