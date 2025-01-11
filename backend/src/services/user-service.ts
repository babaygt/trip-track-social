import { BaseService } from './base-service'
import { IUser, User } from '../models'
import bcrypt from 'bcrypt'
import { Types, ProjectionType } from 'mongoose'

export class UserService extends BaseService<IUser> {
	constructor() {
		super(User)
	}

	protected getDefaultProjection(): ProjectionType<IUser> {
		return {
			password: 0,
			__v: 0,
		}
	}

	protected getPublicProfileProjection(): ProjectionType<IUser> {
		return {
			username: 1,
			name: 1,
			profilePicture: 1,
			bio: 1,
			followers: 1,
			following: 1,
			createdAt: 1,
		}
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
		const user = await this.model.findById(userId).select('+password').exec()
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
		const user = await this.model.findById(userId).select('+password').exec()
		if (!user) {
			throw new Error('User not found')
		}

		const isValid = await bcrypt.compare(oldPassword, user.password)
		if (!isValid) {
			throw new Error('Invalid password')
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10)
		const updatedUser = await this.update(userId, { password: hashedPassword })
		if (!updatedUser) {
			throw new Error('Failed to update password')
		}
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

		if (user.following.includes(new Types.ObjectId(targetUserId))) {
			throw new Error('Already following this user')
		}

		user.following.push(new Types.ObjectId(targetUserId))
		targetUser.followers.push(new Types.ObjectId(userId))

		await Promise.all([user.save(), targetUser.save()])

		return user
	}

	async unfollowUser(userId: string, targetUserId: string): Promise<IUser> {
		if (userId === targetUserId) {
			throw new Error('Users cannot unfollow themselves')
		}

		const [user, targetUser] = await Promise.all([
			this.findById(userId),
			this.findById(targetUserId),
		])

		if (!user || !targetUser) {
			throw new Error('User not found')
		}

		if (!user.following.includes(new Types.ObjectId(targetUserId))) {
			throw new Error('Not following this user')
		}

		user.following = user.following.filter(
			(id) => id.toString() !== targetUserId
		)
		targetUser.followers = targetUser.followers.filter(
			(id) => id.toString() !== userId
		)

		await Promise.all([user.save(), targetUser.save()])

		return user
	}

	async getFollowers(userId: string): Promise<IUser[]> {
		const user = await this.findById(userId, { followers: 1 })
		if (!user) {
			throw new Error('User not found')
		}

		return this.findAll(
			{ _id: { $in: user.followers } },
			{},
			this.getPublicProfileProjection()
		)
	}

	async getFollowing(userId: string): Promise<IUser[]> {
		const user = await this.findById(userId, { following: 1 })
		if (!user) {
			throw new Error('User not found')
		}

		return this.findAll(
			{ _id: { $in: user.following } },
			{},
			this.getPublicProfileProjection()
		)
	}

	async getUserByUsername(username: string): Promise<IUser | null> {
		const user = await this.findOne(
			{ username },
			this.getPublicProfileProjection()
		)

		if (!user) return null

		await this.model.populate(user, [
			{
				path: 'following',
				select: 'username profilePicture name',
			},
			{
				path: 'followers',
				select: 'username profilePicture name',
			},
		])

		return user
	}

	async bookmarkRoute(userId: string, routeId: string): Promise<IUser> {
		if (!Types.ObjectId.isValid(routeId)) {
			throw new Error('Invalid ID format')
		}

		const user = await this.findById(userId)
		if (!user) {
			throw new Error('User not found')
		}

		if (user.bookmarks.includes(new Types.ObjectId(routeId))) {
			throw new Error('Route already bookmarked')
		}

		user.bookmarks.push(new Types.ObjectId(routeId))
		return user.save()
	}

	async removeBookmark(userId: string, routeId: string): Promise<IUser> {
		if (!Types.ObjectId.isValid(routeId)) {
			throw new Error('Invalid ID format')
		}

		const user = await this.findById(userId)
		if (!user) {
			throw new Error('User not found')
		}

		if (!user.bookmarks.includes(new Types.ObjectId(routeId))) {
			throw new Error('Route not bookmarked')
		}

		user.bookmarks = user.bookmarks.filter((id) => id.toString() !== routeId)
		return user.save()
	}
}
