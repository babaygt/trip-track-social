import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/models'

describe('User Routes', () => {
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
})
