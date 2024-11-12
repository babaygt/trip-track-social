import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/models'
import { UserService } from '../../src/services/user-service'

describe('Auth Routes', () => {
	let userService: UserService

	beforeEach(() => {
		userService = new UserService()
	})

	describe('POST /auth/login', () => {
		const validUserData = {
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123',
			bio: 'Test bio',
		}

		it('should login successfully with valid credentials', async () => {
			// Create a test user first
			await userService.createUser(validUserData)

			const response = await request(app)
				.post('/auth/login')
				.send({
					email: validUserData.email,
					password: validUserData.password,
				})
				.expect(200)

			expect(response.body).toEqual({
				id: expect.any(String),
				name: validUserData.name,
				email: validUserData.email,
				isAdmin: false,
			})
		})

		it('should return 400 with invalid email format', async () => {
			const response = await request(app)
				.post('/auth/login')
				.send({
					email: 'invalid-email',
					password: 'password123',
				})
				.expect(400)

			expect(response.body).toHaveProperty('errors')
		})

		it('should return 400 with empty password', async () => {
			const response = await request(app)
				.post('/auth/login')
				.send({
					email: 'test@example.com',
					password: '',
				})
				.expect(400)

			expect(response.body).toHaveProperty('errors')
		})

		it('should return 401 with non-existent email', async () => {
			const response = await request(app)
				.post('/auth/login')
				.send({
					email: 'nonexistent@example.com',
					password: 'password123',
				})
				.expect(401)

			expect(response.body).toEqual({
				message: 'Invalid credentials',
			})
		})

		it('should return 401 with incorrect password', async () => {
			// Create a test user first
			await userService.createUser(validUserData)

			const response = await request(app)
				.post('/auth/login')
				.send({
					email: validUserData.email,
					password: 'wrongpassword',
				})
				.expect(401)

			expect(response.body).toEqual({
				message: 'Invalid credentials',
			})
		})

		afterEach(async () => {
			await User.deleteMany({})
		})
	})
})
