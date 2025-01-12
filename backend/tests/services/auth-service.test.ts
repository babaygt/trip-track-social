import { AuthService } from '../../src/services/auth-service'
import { UserService } from '../../src/services/user-service'
import { User } from '../../src/models'

describe('AuthService', () => {
	let authService: AuthService
	let userService: UserService

	beforeEach(() => {
		authService = new AuthService()
		userService = new UserService()
	})

	describe('login', () => {
		const validUserData = {
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123',
			bio: 'Test bio',
		}

		it('should successfully login with valid credentials', async () => {
			// Create a test user first
			await userService.createUser(validUserData)

			const user = await authService.login(
				validUserData.email,
				validUserData.password
			)

			expect(user).toBeDefined()
			expect(user.email).toBe(validUserData.email)
			expect(user.name).toBe(validUserData.name)
		})

		it('should throw error with non-existent email', async () => {
			await expect(
				authService.login('nonexistent@example.com', 'password123')
			).rejects.toThrow('Invalid credentials')
		})

		it('should throw error with incorrect password', async () => {
			// Create a test user first
			await userService.createUser(validUserData)

			await expect(
				authService.login(validUserData.email, 'wrongpassword')
			).rejects.toThrow('Invalid credentials')
		})

		afterEach(async () => {
			await User.deleteMany({})
		})
	})

	describe('validateSession', () => {
		const validUserData = {
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123',
			bio: 'Test bio',
		}

		it('should successfully validate a valid session', async () => {
			// Create a test user first
			const createdUser = await userService.createUser(validUserData)

			const user = await authService.validateSession(createdUser.id)

			expect(user).toBeDefined()
			expect(user.email).toBe(validUserData.email)
			expect(user.name).toBe(validUserData.name)
		})

		it('should throw error with invalid ObjectId format', async () => {
			await expect(authService.validateSession('invalid-id')).rejects.toThrow(
				'Invalid session'
			)
		})

		it('should throw error with non-existent user ID', async () => {
			const nonExistentId = '507f1f77bcf86cd799439011' // Valid MongoDB ObjectId format
			await expect(authService.validateSession(nonExistentId)).rejects.toThrow(
				'Invalid session'
			)
		})

		afterEach(async () => {
			await User.deleteMany({})
		})
	})
})
