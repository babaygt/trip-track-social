import { BaseService } from './base-service'
import { IRoute, Route } from '../models'
import { Types, ProjectionType } from 'mongoose'

export class RouteError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'RouteError'
	}
}

export class RouteService extends BaseService<IRoute> {
	constructor() {
		super(Route)
	}

	protected getDefaultProjection(): ProjectionType<IRoute> {
		return {
			__v: 0,
		}
	}

	protected getListProjection(): ProjectionType<IRoute> {
		return {
			title: 1,
			creator: 1,
			startPoint: 1,
			endPoint: 1,
			travelMode: 1,
			totalDistance: 1,
			totalTime: 1,
			likes: 1,
			commentCount: 1,
			likeCount: 1,
			visibility: 1,
			createdAt: 1,
		}
	}

	async createRoute(routeData: Partial<IRoute>): Promise<IRoute> {
		const route = await this.create(routeData)
		return this.model
			.findById(route._id)
			.populate('creator', 'name username profilePicture')
			.populate('likes', 'name username profilePicture')
			.exec() as Promise<IRoute>
	}

	async likeRoute(routeId: string, userId: string): Promise<IRoute> {
		if (!Types.ObjectId.isValid(routeId)) {
			throw new RouteError('Invalid ID format')
		}

		const route = await this.findById(routeId)
		if (!route) {
			throw new RouteError('Route not found')
		}

		if (route.isLikedBy(userId)) {
			throw new RouteError('Route already liked')
		}

		const updatedRoute = await this.model
			.findByIdAndUpdate(
				routeId,
				{ $addToSet: { likes: new Types.ObjectId(userId) } },
				{ new: true }
			)
			.populate('creator', 'name username profilePicture')
			.populate('likes', 'name username profilePicture')
			.exec()

		if (!updatedRoute) {
			throw new RouteError('Failed to like route')
		}

		return updatedRoute
	}

	async unlikeRoute(routeId: string, userId: string): Promise<IRoute> {
		if (!Types.ObjectId.isValid(routeId)) {
			throw new RouteError('Invalid ID format')
		}

		const route = await this.findById(routeId)
		if (!route) {
			throw new RouteError('Route not found')
		}

		if (!route.isLikedBy(userId)) {
			throw new RouteError('Route not liked')
		}

		const updatedRoute = await this.update(routeId, {
			$pull: { likes: new Types.ObjectId(userId) },
		})

		if (!updatedRoute) {
			throw new RouteError('Failed to unlike route')
		}

		return updatedRoute
	}

	async addComment(
		routeId: string,
		userId: string,
		content: string
	): Promise<IRoute> {
		if (!Types.ObjectId.isValid(routeId)) {
			throw new RouteError('Invalid ID format')
		}

		if (!content.trim()) {
			throw new RouteError('Comment content is required')
		}

		const route = await this.findById(routeId)
		if (!route) {
			throw new RouteError('Route not found')
		}

		const comment = {
			_id: new Types.ObjectId(),
			user: new Types.ObjectId(userId),
			content: content.trim(),
			createdAt: new Date(),
		}

		const updatedRoute = await this.model
			.findByIdAndUpdate(
				routeId,
				{ $push: { comments: { $each: [comment], $position: 0 } } },
				{ new: true }
			)
			.populate({
				path: 'creator',
				select: 'name username profilePicture',
				model: 'User',
			})
			.populate({
				path: 'likes',
				select: 'name username profilePicture',
				model: 'User',
			})
			.populate({
				path: 'comments.user',
				select: 'name username profilePicture',
				model: 'User',
			})
			.exec()

		if (!updatedRoute) {
			throw new RouteError('Failed to add comment')
		}

		return updatedRoute
	}

	async removeComment(
		routeId: string,
		commentId: string,
		userId: string
	): Promise<IRoute> {
		if (!Types.ObjectId.isValid(routeId)) {
			throw new RouteError('Invalid ID format')
		}

		if (!Types.ObjectId.isValid(commentId)) {
			throw new RouteError('Invalid ID format')
		}

		const route = await this.findById(routeId)
		if (!route) {
			throw new RouteError('Route not found')
		}

		const comment = route.comments.find((c) => c._id?.toString() === commentId)
		if (!comment) {
			throw new RouteError('Comment not found')
		}

		if (!comment.isOwner(userId)) {
			throw new RouteError('Not authorized to remove this comment')
		}

		const updatedRoute = await this.model
			.findByIdAndUpdate(
				routeId,
				{ $pull: { comments: { _id: new Types.ObjectId(commentId) } } },
				{ new: true }
			)
			.populate({
				path: 'creator',
				select: 'name username profilePicture',
				model: 'User',
			})
			.populate({
				path: 'likes',
				select: 'name username profilePicture',
				model: 'User',
			})
			.populate({
				path: 'comments.user',
				select: 'name username profilePicture',
				model: 'User',
			})
			.exec()

		if (!updatedRoute) {
			throw new RouteError('Failed to remove comment')
		}

		return updatedRoute
	}

	async getRoutesByUser(
		userId: string,
		page: number = 1,
		limit: number = 10
	): Promise<{ data: IRoute[]; total: number; pages: number }> {
		if (!Types.ObjectId.isValid(userId)) {
			throw new RouteError('Invalid ID format')
		}

		const skip = (page - 1) * limit
		const query = { creator: new Types.ObjectId(userId) }
		const total = await this.model.countDocuments(query)
		const pages = Math.ceil(total / limit)

		const routes = await this.model
			.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate('creator', 'name username profilePicture')
			.populate('likes', 'name username profilePicture')
			.exec()

		return { data: routes, total, pages }
	}

	async searchRoutes(query: string, page = 1, limit = 10) {
		const searchRegex = new RegExp(query.trim(), 'i')
		return this.findWithPagination(
			{
				$and: [
					{ visibility: 'public' },
					{
						$or: [
							{ title: searchRegex },
							{ description: searchRegex },
							{ tags: searchRegex },
						],
					},
				],
			},
			page,
			limit,
			{ sort: { createdAt: -1 } }
		)
	}

	async getNearbyRoutes(
		lat: number,
		lng: number,
		radiusKm = 10,
		page = 1,
		limit = 10
	) {
		const earthRadiusKm = 6371
		return this.findWithPagination(
			{
				$and: [
					{ visibility: 'public' },
					{
						$or: [
							{
								startPoint: {
									$geoWithin: {
										$centerSphere: [[lng, lat], radiusKm / earthRadiusKm],
									},
								},
							},
							{
								endPoint: {
									$geoWithin: {
										$centerSphere: [[lng, lat], radiusKm / earthRadiusKm],
									},
								},
							},
						],
					},
				],
			},
			page,
			limit,
			{ sort: { createdAt: -1 } }
		)
	}

	async getPublicRoutes(page = 1, limit = 10) {
		return this.findWithPagination({ visibility: 'public' }, page, limit, {
			sort: { createdAt: -1 },
			populate: {
				path: 'creator',
				select: 'name username profilePicture',
				model: 'User',
			},
		})
	}

	async getRoute(routeId: string): Promise<IRoute> {
		if (!Types.ObjectId.isValid(routeId)) {
			throw new Error('Invalid ID format')
		}
		const route = await this.model
			.findById(routeId)
			.populate('creator', 'name username profilePicture')
			.populate('likes', 'name username profilePicture')
			.populate({
				path: 'comments.user',
				select: 'name username profilePicture',
				model: 'User',
			})
			.exec()
		if (!route) {
			throw new Error('Route not found')
		}
		return route
	}
}
