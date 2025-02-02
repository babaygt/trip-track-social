import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/models'
import { UserService } from '../../src/services/user-service'
import { RouteService } from '../../src/services/route-service'
import { Types } from 'mongoose'
import { TravelMode } from '../../src/models/route'

describe('User Routes', () => {
	// Create user tests
	describe('POST /users', () => {
		const validUserData = {
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123',
			bio: 'Test bio',
		}

		it('should create a new user successfully', async () => {
			const response = await request(app)
				.post('/users')
				.send(validUserData)
				.expect(201)

			// Check response structure
			expect(response.body).toHaveProperty('_id')
			expect(response.body.name).toBe(validUserData.name)
			expect(response.body.username).toBe(validUserData.username)
			expect(response.body.email).toBe(validUserData.email)
			expect(response.body).not.toHaveProperty('password')

			// Verify user was actually saved in database
			const user = await User.findById(response.body._id)
			expect(user).toBeTruthy()
			expect(user?.name).toBe(validUserData.name)
		})

		it('should return 400 if email already exists', async () => {
			// First create a user
			await request(app).post('/users').send(validUserData)

			// Try to create another user with same email
			const response = await request(app)
				.post('/users')
				.send({
					...validUserData,
					username: 'different',
				})
				.expect(400)

			expect(response.body).toEqual({
				message: 'Email already exists',
			})
		})

		it('should return 400 if username already exists', async () => {
			// First create a user
			await request(app).post('/users').send(validUserData)

			// Try to create another user with same username
			const response = await request(app)
				.post('/users')
				.send({
					...validUserData,
					email: 'different@example.com',
				})
				.expect(400)

			expect(response.body).toEqual({
				message: 'Username already exists',
			})
		})

		it('should return 400 if required fields are missing', async () => {
			const response = await request(app)
				.post('/users')
				.send({
					name: 'Test User',
				})
				.expect(400)

			expect(response.body).toHaveProperty('message')
		})
	})

	// Update password tests

	describe('PUT /users/:userId/password', () => {
		const validUserData = {
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123',
			bio: 'Test bio',
		}

		it('should update password successfully with valid credentials', async () => {
			// First create a user
			const createResponse = await request(app)
				.post('/users')
				.send(validUserData)
				.expect(201)

			const userId = createResponse.body._id

			// Update password
			const response = await request(app)
				.put(`/users/${userId}/password`)
				.send({
					oldPassword: 'password123',
					newPassword: 'newpassword123',
				})
				.expect(200)

			expect(response.body).toHaveProperty('_id')
			expect(response.body).not.toHaveProperty('password')

			// Verify new password works by creating a test user service and verifying
			const userService = new UserService()
			const isValid = await userService.verifyPassword(userId, 'newpassword123')
			expect(isValid).toBe(true)
		})

		it('should return 400 if old password is incorrect', async () => {
			// First create a user
			const createResponse = await request(app)
				.post('/users')
				.send(validUserData)
				.expect(201)

			const userId = createResponse.body._id

			// Try to update with wrong old password
			const response = await request(app)
				.put(`/users/${userId}/password`)
				.send({
					oldPassword: 'wrongpassword',
					newPassword: 'newpassword123',
				})
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid password',
			})
		})

		it('should return 400 if user does not exist', async () => {
			const nonExistentId = '507f1f77bcf86cd799439011'

			const response = await request(app)
				.put(`/users/${nonExistentId}/password`)
				.send({
					oldPassword: 'password123',
					newPassword: 'newpassword123',
				})
				.expect(400)

			expect(response.body).toEqual({
				message: 'User not found',
			})
		})

		it('should return 400 if user ID is invalid', async () => {
			const invalidId = 'invalid-id'

			const response = await request(app)
				.put(`/users/${invalidId}/password`)
				.send({
					oldPassword: 'password123',
					newPassword: 'newpassword123',
				})
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})
	})

	// Follow user tests

	describe('POST /users/:userId/follow/:targetUserId', () => {
		const user1Data = {
			name: 'Test User 1',
			username: 'testuser1',
			email: 'test1@example.com',
			password: 'password123',
			bio: 'Test bio 1',
		}

		const user2Data = {
			name: 'Test User 2',
			username: 'testuser2',
			email: 'test2@example.com',
			password: 'password123',
			bio: 'Test bio 2',
		}

		it('should successfully follow another user', async () => {
			// Create two users
			const user1Response = await request(app)
				.post('/users')
				.send(user1Data)
				.expect(201)
			const user2Response = await request(app)
				.post('/users')
				.send(user2Data)
				.expect(201)

			// Follow user
			const response = await request(app)
				.post(
					`/users/${user1Response.body._id}/follow/${user2Response.body._id}`
				)
				.expect(200)

			// Check response
			expect(response.body.following).toHaveLength(1)
			expect(response.body.following[0]._id.toString()).toBe(
				user2Response.body._id
			)

			// Verify in database
			const targetUser = await User.findById(user2Response.body._id)
			expect(targetUser?.followers).toHaveLength(1)
			expect(targetUser?.followers[0]._id.toString()).toBe(
				user1Response.body._id
			)
		})

		it('should return 400 when user tries to follow themselves', async () => {
			const userResponse = await request(app)
				.post('/users')
				.send(user1Data)
				.expect(201)

			const response = await request(app)
				.post(`/users/${userResponse.body._id}/follow/${userResponse.body._id}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Users cannot follow themselves',
			})
		})

		it('should return 400 when target user does not exist', async () => {
			const userResponse = await request(app)
				.post('/users')
				.send(user1Data)
				.expect(201)

			const nonExistentId = '507f1f77bcf86cd799439011'

			const response = await request(app)
				.post(`/users/${userResponse.body._id}/follow/${nonExistentId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'User not found',
			})
		})

		it('should return 400 when user tries to follow someone they already follow', async () => {
			// Create two users
			const user1Response = await request(app)
				.post('/users')
				.send(user1Data)
				.expect(201)
			const user2Response = await request(app)
				.post('/users')
				.send(user2Data)
				.expect(201)

			// First follow
			await request(app)
				.post(
					`/users/${user1Response.body._id}/follow/${user2Response.body._id}`
				)
				.expect(200)

			// Try to follow again
			const response = await request(app)
				.post(
					`/users/${user1Response.body._id}/follow/${user2Response.body._id}`
				)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Already following this user',
			})
		})

		it('should return 400 if user ID is invalid', async () => {
			const invalidId = 'invalid-id'
			const userResponse = await request(app)
				.post('/users')
				.send(user1Data)
				.expect(201)

			const response = await request(app)
				.post(`/users/${invalidId}/follow/${userResponse.body._id}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})
	})

	describe('DELETE /users/:userId/follow/:targetUserId', () => {
		const user1Data = {
			name: 'Test User 1',
			username: 'testuser1',
			email: 'test1@example.com',
			password: 'password123',
			bio: 'Test bio 1',
		}

		const user2Data = {
			name: 'Test User 2',
			username: 'testuser2',
			email: 'test2@example.com',
			password: 'password123',
			bio: 'Test bio 2',
		}

		it('should successfully unfollow another user', async () => {
			// Create two users
			const user1Response = await request(app)
				.post('/users')
				.send(user1Data)
				.expect(201)
			const user2Response = await request(app)
				.post('/users')
				.send(user2Data)
				.expect(201)

			// First follow the user
			await request(app)
				.post(
					`/users/${user1Response.body._id}/follow/${user2Response.body._id}`
				)
				.expect(200)

			// Then unfollow
			const response = await request(app)
				.delete(
					`/users/${user1Response.body._id}/follow/${user2Response.body._id}`
				)
				.expect(200)

			// Check response
			expect(response.body.following).toHaveLength(0)

			// Verify in database
			const targetUser = await User.findById(user2Response.body._id)
			expect(targetUser?.followers).toHaveLength(0)
		})

		it('should return 400 when user tries to unfollow themselves', async () => {
			const userResponse = await request(app)
				.post('/users')
				.send(user1Data)
				.expect(201)

			const response = await request(app)
				.delete(
					`/users/${userResponse.body._id}/follow/${userResponse.body._id}`
				)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Users cannot unfollow themselves',
			})
		})

		it('should return 400 when target user does not exist', async () => {
			const userResponse = await request(app)
				.post('/users')
				.send(user1Data)
				.expect(201)

			const nonExistentId = '507f1f77bcf86cd799439011'

			const response = await request(app)
				.delete(`/users/${userResponse.body._id}/follow/${nonExistentId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'User not found',
			})
		})

		it('should return 400 when user tries to unfollow someone they do not follow', async () => {
			const user1Response = await request(app)
				.post('/users')
				.send(user1Data)
				.expect(201)
			const user2Response = await request(app)
				.post('/users')
				.send(user2Data)
				.expect(201)

			const response = await request(app)
				.delete(
					`/users/${user1Response.body._id}/follow/${user2Response.body._id}`
				)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Not following this user',
			})
		})

		it('should return 400 if user ID is invalid', async () => {
			const invalidId = 'invalid-id'
			const userResponse = await request(app)
				.post('/users')
				.send(user1Data)
				.expect(201)

			const response = await request(app)
				.delete(`/users/${invalidId}/follow/${userResponse.body._id}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})
	})

	describe('GET /users/:userId/followers', () => {
		const user1Data = {
			name: 'Test User 1',
			username: 'testuser1',
			email: 'test1@example.com',
			password: 'password123',
			bio: 'Test bio 1',
		}

		const user2Data = {
			name: 'Test User 2',
			username: 'testuser2',
			email: 'test2@example.com',
			password: 'password123',
			bio: 'Test bio 2',
		}

		it('should return followers for a user', async () => {
			// Create two users
			const user1Response = await request(app)
				.post('/users')
				.send(user1Data)
				.expect(201)
			const user2Response = await request(app)
				.post('/users')
				.send(user2Data)
				.expect(201)

			// Make user2 follow user1
			await request(app)
				.post(
					`/users/${user2Response.body._id}/follow/${user1Response.body._id}`
				)
				.expect(200)

			// Get followers of user1
			const response = await request(app)
				.get(`/users/${user1Response.body._id}/followers`)
				.expect(200)

			expect(response.body).toHaveLength(1)
			expect(response.body[0]._id.toString()).toBe(user2Response.body._id)
			expect(response.body[0].username).toBe(user2Data.username)
			expect(response.body[0].name).toBe(user2Data.name)
			expect(response.body[0]).not.toHaveProperty('password')
		})

		it('should return empty array for user with no followers', async () => {
			const userResponse = await request(app)
				.post('/users')
				.send(user1Data)
				.expect(201)

			const response = await request(app)
				.get(`/users/${userResponse.body._id}/followers`)
				.expect(200)

			expect(response.body).toHaveLength(0)
			expect(Array.isArray(response.body)).toBe(true)
		})

		it('should return 400 when user does not exist', async () => {
			const nonExistentId = '507f1f77bcf86cd799439011'

			const response = await request(app)
				.get(`/users/${nonExistentId}/followers`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'User not found',
			})
		})

		it('should return 400 for invalid user ID format', async () => {
			const invalidId = 'invalid-id'

			const response = await request(app)
				.get(`/users/${invalidId}/followers`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})
	})

	describe('GET /users/:userId/following', () => {
		const user1Data = {
			name: 'Test User 1',
			username: 'testuser1',
			email: 'test1@example.com',
			password: 'password123',
			bio: 'Test bio 1',
		}

		const user2Data = {
			name: 'Test User 2',
			username: 'testuser2',
			email: 'test2@example.com',
			password: 'password123',
			bio: 'Test bio 2',
		}

		it('should return users that the user is following', async () => {
			// Create two users
			const user1Response = await request(app)
				.post('/users')
				.send(user1Data)
				.expect(201)
			const user2Response = await request(app)
				.post('/users')
				.send(user2Data)
				.expect(201)

			// Make user1 follow user2
			await request(app)
				.post(
					`/users/${user1Response.body._id}/follow/${user2Response.body._id}`
				)
				.expect(200)

			// Get following of user1
			const response = await request(app)
				.get(`/users/${user1Response.body._id}/following`)
				.expect(200)

			expect(response.body).toHaveLength(1)
			expect(response.body[0]._id.toString()).toBe(user2Response.body._id)
			expect(response.body[0].username).toBe(user2Data.username)
			expect(response.body[0].name).toBe(user2Data.name)
			expect(response.body[0]).not.toHaveProperty('password')
		})

		it('should return empty array for user not following anyone', async () => {
			const userResponse = await request(app)
				.post('/users')
				.send(user1Data)
				.expect(201)

			const response = await request(app)
				.get(`/users/${userResponse.body._id}/following`)
				.expect(200)

			expect(response.body).toHaveLength(0)
			expect(Array.isArray(response.body)).toBe(true)
		})

		it('should return 400 when user does not exist', async () => {
			const nonExistentId = '507f1f77bcf86cd799439011'

			const response = await request(app)
				.get(`/users/${nonExistentId}/following`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'User not found',
			})
		})

		it('should return 400 for invalid user ID format', async () => {
			const invalidId = 'invalid-id'

			const response = await request(app)
				.get(`/users/${invalidId}/following`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})
	})

	// Get user by ID

	describe('GET /users/:userId', () => {
		const userData = {
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123',
			bio: 'Test bio',
		}

		it('should return user by ID', async () => {
			// First create a user
			const createResponse = await request(app)
				.post('/users')
				.send(userData)
				.expect(201)

			// Get user by ID
			const response = await request(app)
				.get(`/users/${createResponse.body._id}`)
				.expect(200)

			expect(response.body._id).toBe(createResponse.body._id)
			expect(response.body.name).toBe(userData.name)
			expect(response.body.username).toBe(userData.username)
			expect(response.body.email).toBe(userData.email)
			expect(response.body.bio).toBe(userData.bio)
			expect(response.body).not.toHaveProperty('password')
		})

		it('should return 404 when user does not exist', async () => {
			const nonExistentId = '507f1f77bcf86cd799439011'

			const response = await request(app)
				.get(`/users/${nonExistentId}`)
				.expect(404)

			expect(response.body).toEqual({
				message: 'User not found',
			})
		})

		it('should return 400 for invalid user ID format', async () => {
			const invalidId = 'invalid-id'

			const response = await request(app).get(`/users/${invalidId}`).expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})
	})

	describe('POST /users/:userId/bookmarks/:routeId', () => {
		const userData = {
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123',
			bio: 'Test bio',
		}

		let routeId: string
		let routeService: RouteService

		beforeEach(async () => {
			routeService = new RouteService()
			const route = await routeService.createRoute({
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

		it('should successfully bookmark a route', async () => {
			// Create a user first
			const createResponse = await request(app)
				.post('/users')
				.send(userData)
				.expect(201)

			const userId = createResponse.body._id

			// Bookmark the route
			const response = await request(app)
				.post(`/users/${userId}/bookmarks/${routeId}`)
				.expect(200)

			expect(response.body.bookmarks).toHaveLength(1)
			expect(response.body.bookmarks[0]._id.toString()).toBe(routeId)
		})

		it('should return 400 when trying to bookmark the same route twice', async () => {
			// Create a user first
			const createResponse = await request(app)
				.post('/users')
				.send(userData)
				.expect(201)

			const userId = createResponse.body._id

			// First bookmark
			await request(app)
				.post(`/users/${userId}/bookmarks/${routeId}`)
				.expect(200)

			// Try to bookmark again
			const response = await request(app)
				.post(`/users/${userId}/bookmarks/${routeId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Route already bookmarked',
			})
		})

		it('should return 400 when user does not exist', async () => {
			const nonExistentId = '507f1f77bcf86cd799439011'

			const response = await request(app)
				.post(`/users/${nonExistentId}/bookmarks/${routeId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'User not found',
			})
		})

		it('should return 400 for invalid route ID format', async () => {
			// Create a user first
			const createResponse = await request(app)
				.post('/users')
				.send(userData)
				.expect(201)

			const userId = createResponse.body._id
			const invalidRouteId = 'invalid-id'

			const response = await request(app)
				.post(`/users/${userId}/bookmarks/${invalidRouteId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})
	})

	describe('DELETE /users/:userId/bookmarks/:routeId', () => {
		const userData = {
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123',
			bio: 'Test bio',
		}

		let routeId: string
		let routeService: RouteService

		beforeEach(async () => {
			routeService = new RouteService()
			const route = await routeService.createRoute({
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

		it('should successfully remove a bookmark', async () => {
			// Create a user first
			const createResponse = await request(app)
				.post('/users')
				.send(userData)
				.expect(201)

			const userId = createResponse.body._id

			// First bookmark the route
			await request(app)
				.post(`/users/${userId}/bookmarks/${routeId}`)
				.expect(200)

			// Then remove the bookmark
			const response = await request(app)
				.delete(`/users/${userId}/bookmarks/${routeId}`)
				.expect(200)

			expect(response.body.bookmarks).toHaveLength(0)
		})

		it('should return 400 when route is not bookmarked', async () => {
			// Create a user first
			const createResponse = await request(app)
				.post('/users')
				.send(userData)
				.expect(201)

			const userId = createResponse.body._id

			const response = await request(app)
				.delete(`/users/${userId}/bookmarks/${routeId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Route not bookmarked',
			})
		})

		it('should return 400 when user does not exist', async () => {
			const nonExistentId = '507f1f77bcf86cd799439011'

			const response = await request(app)
				.delete(`/users/${nonExistentId}/bookmarks/${routeId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'User not found',
			})
		})

		it('should return 400 for invalid route ID format', async () => {
			// Create a user first
			const createResponse = await request(app)
				.post('/users')
				.send(userData)
				.expect(201)

			const userId = createResponse.body._id
			const invalidRouteId = 'invalid-id'

			const response = await request(app)
				.delete(`/users/${userId}/bookmarks/${invalidRouteId}`)
				.expect(400)

			expect(response.body).toEqual({
				message: 'Invalid ID format',
			})
		})
	})

	describe('GET /users/find/:username', () => {
		const userData = {
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123',
			bio: 'Test bio',
		}

		it('should return user by username', async () => {
			// First create a user
			await request(app).post('/users').send(userData).expect(201)

			// Get user by username
			const response = await request(app)
				.get(`/users/find/${userData.username}`)
				.expect(200)

			expect(response.body.username).toBe(userData.username)
			expect(response.body.name).toBe(userData.name)
			expect(response.body.email).toBe(userData.email)
			expect(response.body.bio).toBe(userData.bio)
			expect(response.body).not.toHaveProperty('password')
		})

		it('should return 404 when username does not exist', async () => {
			const response = await request(app)
				.get('/users/find/nonexistentuser')
				.expect(404)

			expect(response.body).toEqual({
				message: 'User not found',
			})
		})

		it('should return 400 when username is empty', async () => {
			const response = await request(app).get('/users/find/').expect(400)

			expect(response.body).toEqual({
				message: 'Username is required',
			})
		})
	})
})
