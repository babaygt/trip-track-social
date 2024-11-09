import { UserService } from '../../src/services/user-service'
import bcrypt from 'bcrypt'

describe('UserService', () => {
	let userService: UserService

	beforeEach(() => {
		userService = new UserService()
	})

	// Create user tests

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

	// Verify password tests

	describe('verifyPassword', () => {
		const validUserData = {
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123',
			bio: 'Test bio',
		}

		it('should return true for correct password', async () => {
			const user = await userService.createUser(validUserData)
			const isValid = await userService.verifyPassword(user.id, 'password123')
			expect(isValid).toBe(true)
		})

		it('should return false for incorrect password', async () => {
			const user = await userService.createUser(validUserData)
			const isValid = await userService.verifyPassword(user.id, 'wrongpassword')
			expect(isValid).toBe(false)
		})

		it('should throw error for non-existent user', async () => {
			const nonExistentId = '507f1f77bcf86cd799439011' // Valid MongoDB ObjectId format
			await expect(
				userService.verifyPassword(nonExistentId, 'password123')
			).rejects.toThrow('User not found')
		})

		it('should throw error for invalid user ID format', async () => {
			const invalidId = 'invalid-id'
			await expect(
				userService.verifyPassword(invalidId, 'password123')
			).rejects.toThrow('Invalid ID format')
		})
	})
})
