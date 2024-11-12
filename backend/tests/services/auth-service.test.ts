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
			expect(user).not.toHaveProperty('password')
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
})
