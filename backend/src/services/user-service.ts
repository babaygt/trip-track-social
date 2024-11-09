import { BaseService } from './base-service'
import { IUser, User } from '../models'
import bcrypt from 'bcrypt'

export class UserService extends BaseService<IUser> {
	constructor() {
		super(User)
	}

	async createUser(userData: Partial<IUser>): Promise<IUser> {
		if (await this.exists({ email: userData.email })) {
			throw new Error('Email already exists')
		}
		if (await this.exists({ username: userData.username })) {
			throw new Error('Username already exists')
		}

		const hashedPassword = await bcrypt.hash(userData.password!, 10)
		return this.create({ ...userData, password: hashedPassword })
	}
}
