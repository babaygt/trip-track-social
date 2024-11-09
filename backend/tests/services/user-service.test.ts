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

	// Update password tests

	describe('updatePassword', () => {
		const validUserData = {
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123',
			bio: 'Test bio',
		}

		it('should successfully update password with valid credentials', async () => {
			const user = await userService.createUser(validUserData)
			const updatedUser = await userService.updatePassword(
				user.id,
				'password123',
				'newpassword123'
			)

			expect(updatedUser).toBeDefined()
			// Verify new password works
			const isValidNewPassword = await bcrypt.compare(
				'newpassword123',
				updatedUser.password
			)
			expect(isValidNewPassword).toBe(true)
			// Verify old password doesn't work
			const isValidOldPassword = await bcrypt.compare(
				'password123',
				updatedUser.password
			)
			expect(isValidOldPassword).toBe(false)
		})

		it('should throw error for incorrect old password', async () => {
			const user = await userService.createUser(validUserData)
			await expect(
				userService.updatePassword(user.id, 'wrongpassword', 'newpassword123')
			).rejects.toThrow('Invalid password')
		})

		it('should throw error for non-existent user', async () => {
			const nonExistentId = '507f1f77bcf86cd799439011' // Valid MongoDB ObjectId format
			await expect(
				userService.updatePassword(
					nonExistentId,
					'password123',
					'newpassword123'
				)
			).rejects.toThrow('User not found')
		})

		it('should throw error for invalid user ID format', async () => {
			const invalidId = 'invalid-id'
			await expect(
				userService.updatePassword(invalidId, 'password123', 'newpassword123')
			).rejects.toThrow('Invalid ID format')
		})
	})

	// Follow user tests

	describe('followUser', () => {
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
			const user1 = await userService.createUser(user1Data)
			const user2 = await userService.createUser(user2Data)

			const updatedUser = await userService.followUser(user1.id, user2.id)

			expect(updatedUser.following).toHaveLength(1)
			expect(updatedUser.following[0]._id.toString()).toBe(user2.id)

			// Verify target user's followers were updated
			const targetUser = await userService.findById(user2.id)
			expect(targetUser?.followers).toHaveLength(1)
			expect(targetUser?.followers[0]._id.toString()).toBe(user1.id)
		})

		it('should throw error when user tries to follow themselves', async () => {
			const user = await userService.createUser(user1Data)

			await expect(userService.followUser(user.id, user.id)).rejects.toThrow(
				'Users cannot follow themselves'
			)
		})

		it('should throw error when user tries to follow non-existent user', async () => {
			const user = await userService.createUser(user1Data)
			const nonExistentId = '507f1f77bcf86cd799439011'

			await expect(
				userService.followUser(user.id, nonExistentId)
			).rejects.toThrow('User not found')
		})

		it('should throw error when user tries to follow someone they already follow', async () => {
			const user1 = await userService.createUser(user1Data)
			const user2 = await userService.createUser(user2Data)

			// First follow
			await userService.followUser(user1.id, user2.id)

			// Try to follow again
			await expect(userService.followUser(user1.id, user2.id)).rejects.toThrow(
				'Already following this user'
			)
		})

		it('should throw error for invalid user ID format', async () => {
			const user = await userService.createUser(user1Data)
			const invalidId = 'invalid-id'

			await expect(userService.followUser(user.id, invalidId)).rejects.toThrow(
				'Invalid ID format'
			)
		})
	})

	// Unfollow user tests

	describe('unfollowUser', () => {
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
			const user1 = await userService.createUser(user1Data)
			const user2 = await userService.createUser(user2Data)

			// First follow the user
			await userService.followUser(user1.id, user2.id)

			// Then unfollow
			const updatedUser = await userService.unfollowUser(user1.id, user2.id)

			expect(updatedUser.following).toHaveLength(0)

			// Verify target user's followers were updated
			const targetUser = await userService.findById(user2.id)
			expect(targetUser?.followers).toHaveLength(0)
		})

		it('should throw error when user tries to unfollow themselves', async () => {
			const user = await userService.createUser(user1Data)

			await expect(userService.unfollowUser(user.id, user.id)).rejects.toThrow(
				'Users cannot unfollow themselves'
			)
		})

		it('should throw error when user tries to unfollow non-existent user', async () => {
			const user = await userService.createUser(user1Data)
			const nonExistentId = '507f1f77bcf86cd799439011'

			await expect(
				userService.unfollowUser(user.id, nonExistentId)
			).rejects.toThrow('User not found')
		})

		it('should throw error when user tries to unfollow someone they do not follow', async () => {
			const user1 = await userService.createUser(user1Data)
			const user2 = await userService.createUser(user2Data)

			await expect(
				userService.unfollowUser(user1.id, user2.id)
			).rejects.toThrow('Not following this user')
		})

		it('should throw error for invalid user ID format', async () => {
			const user = await userService.createUser(user1Data)
			const invalidId = 'invalid-id'

			await expect(
				userService.unfollowUser(user.id, invalidId)
			).rejects.toThrow('Invalid ID format')
		})
	})

	// Get followers tests
	describe('getFollowers', () => {
		const userData = {
			name: 'John Doe',
			username: 'johndoe',
			email: 'john@example.com',
			password: 'password123',
			bio: 'Hello, I am John!',
		}

		it('should return followers for a user', async () => {
			const user1 = await userService.createUser(userData)
			const user2 = await userService.createUser({
				name: 'Jane Smith',
				username: 'janesmith',
				email: 'jane@example.com',
				password: 'password123',
				bio: 'Hello, I am Jane!',
			})

			// user2 follows user1
			await userService.followUser(user2.id, user1.id)

			const followers = await userService.getFollowers(user1.id)

			expect(followers).toHaveLength(1)
			expect(followers[0].id).toBe(user2.id)
			expect(followers[0].username).toBe('janesmith')
		})

		it('should return an empty array if user has no followers', async () => {
			const user = await userService.createUser(userData)

			const followers = await userService.getFollowers(user.id)

			expect(followers).toHaveLength(0)
		})

		it('should throw an error if user does not exist', async () => {
			const nonExistentId = '507f1f77bcf86cd799439011'

			await expect(userService.getFollowers(nonExistentId)).rejects.toThrow(
				'User not found'
			)
		})

		it('should throw an error for invalid user ID format', async () => {
			const invalidId = 'invalid-id'

			await expect(userService.getFollowers(invalidId)).rejects.toThrow(
				'Invalid ID format'
			)
		})
	})
})
