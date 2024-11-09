import { UserService } from '../../src/services/user-service'
import bcrypt from 'bcrypt'

describe('UserService', () => {
	let userService: UserService

	beforeEach(() => {
		userService = new UserService()
	})

	describe('createUser', () => {
		const validUserData = {
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123',
			bio: 'Test bio',
		}

		it('should create a new user successfully', async () => {
			const user = await userService.createUser(validUserData)

			expect(user).toBeDefined()
			expect(user.name).toBe(validUserData.name)
			expect(user.username).toBe(validUserData.username)
			expect(user.email).toBe(validUserData.email)

			// Verify password was hashed
			const passwordMatch = await bcrypt.compare(
				validUserData.password,
				user.password
			)
			expect(passwordMatch).toBe(true)
		})

		it('should throw error if email already exists', async () => {
			await userService.createUser(validUserData)

			await expect(
				userService.createUser({
					...validUserData,
					username: 'different',
				})
			).rejects.toThrow('Email already exists')
		})

		it('should throw error if username already exists', async () => {
			await userService.createUser(validUserData)

			await expect(
				userService.createUser({
					...validUserData,
					email: 'different@example.com',
				})
			).rejects.toThrow('Username already exists')
		})
	})
})
