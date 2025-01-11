import { UserService } from './user-service'
import { IUser } from '../models'
import { Types } from 'mongoose'

export class AuthError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'AuthError'
	}
}

export class AuthService {
	private userService: UserService

	constructor() {
		this.userService = new UserService()
	}

	async login(email: string, password: string): Promise<IUser> {
		if (!email || !password) {
			throw new AuthError('Email and password are required')
		}

		const user = await this.userService.findOne(
			{ email },
			{ password: 1, email: 1, username: 1, name: 1 }
		)

		if (!user) {
			throw new AuthError('Invalid credentials')
		}

		const isValidPassword = await this.userService.verifyPassword(
			user.id,
			password
		)

		if (!isValidPassword) {
			throw new AuthError('Invalid credentials')
		}

		// Get full user data without password
		const fullUser = await this.userService.findById(user.id)
		if (!fullUser) {
			throw new AuthError('User not found')
		}

		return fullUser
	}

	async validateSession(userId: string): Promise<IUser> {
		if (!userId || !Types.ObjectId.isValid(userId)) {
			throw new AuthError('Invalid session')
		}

		const user = await this.userService.findById(userId)
		if (!user) {
			throw new AuthError('Invalid session')
		}

		return user
	}
}
