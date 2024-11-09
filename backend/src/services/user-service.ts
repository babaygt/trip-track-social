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

	async verifyPassword(userId: string, password: string): Promise<boolean> {
		const user = await this.findById(userId)
		if (!user) {
			throw new Error('User not found')
		}
		return bcrypt.compare(password, user.password)
	}

	async updatePassword(
		userId: string,
		oldPassword: string,
		newPassword: string
	): Promise<IUser> {
		const user = await this.findById(userId)
		if (!user) {
			throw new Error('User not found')
		}

		const isValid = await bcrypt.compare(oldPassword, user.password)
		if (!isValid) {
			throw new Error('Invalid password')
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10)
		const updatedUser = await this.update(userId, { password: hashedPassword })
		if (!updatedUser) throw new Error('Failed to update password')
		return updatedUser
	}

	async followUser(userId: string, targetUserId: string): Promise<IUser> {
		if (userId === targetUserId) {
			throw new Error('Users cannot follow themselves')
		}

		const [user, targetUser] = await Promise.all([
			this.findById(userId),
			this.findById(targetUserId),
		])

		if (!user || !targetUser) {
			throw new Error('User not found')
		}

		const isAlreadyFollowing = user.following.some(
			(followedUser) =>
				followedUser._id?.toString() === targetUserId ||
				followedUser.toString() === targetUserId
		)
		if (isAlreadyFollowing) {
			throw new Error('Already following this user')
		}

		await Promise.all([
			this.update(userId, { $push: { following: targetUserId } }),
			this.update(targetUserId, { $push: { followers: userId } }),
		])

		const updatedUser = await this.findById(userId)
		if (!updatedUser) throw new Error('Failed to follow user')
		return updatedUser
	}
}
