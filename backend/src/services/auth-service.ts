import { UserService } from './user-service'
import { IUser } from '../models'
import { Types } from 'mongoose'

export class AuthService {
	private userService: UserService

	constructor() {
		this.userService = new UserService()
	}

	async login(email: string, password: string): Promise<IUser> {
		const user = await this.userService.findOne({ email })
		if (!user) {
			throw new Error('Invalid credentials')
		}

		const isValidPassword = await this.userService.verifyPassword(
			user.id,
			password
		)
		if (!isValidPassword) {
			throw new Error('Invalid credentials')
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _pwd, ...userWithoutPassword } = user.toObject()
		return userWithoutPassword as IUser
	}

	async validateSession(userId: string): Promise<IUser> {
		if (!Types.ObjectId.isValid(userId)) {
			throw new Error('Invalid session')
		}

		const user = await this.userService.findById(userId)
		if (!user) {
			throw new Error('Invalid session')
		}

		return user
	}
}
