import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/models'
import { UserService } from '../../src/services/user-service'

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
})
