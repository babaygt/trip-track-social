import { BaseService } from './base-service'
import { IRoute, Route } from '../models'
import { Types } from 'mongoose'

export class RouteService extends BaseService<IRoute> {
	constructor() {
		super(Route)
	}

	async createRoute(routeData: Partial<IRoute>): Promise<IRoute> {
		return this.create(routeData)
	}

	async likeRoute(routeId: string, userId: string): Promise<IRoute> {
		const route = await this.findById(routeId)
		if (!route) {
			throw new Error('Route not found')
		}

		if (route.isLikedBy(userId)) {
			throw new Error('Route already liked')
		}

		const updatedRoute = await this.update(routeId, {
			$push: { likes: userId },
		})

		if (!updatedRoute) throw new Error('Failed to like route')
		return updatedRoute
	}

	async unlikeRoute(routeId: string, userId: string): Promise<IRoute> {
		const route = await this.findById(routeId)
		if (!route) {
			throw new Error('Route not found')
		}

		if (!route.isLikedBy(userId)) {
			throw new Error('Route not liked')
		}

		const updatedRoute = await this.update(routeId, {
			$pull: { likes: userId },
		})

		if (!updatedRoute) throw new Error('Failed to unlike route')
		return updatedRoute
	}

	async addComment(
		routeId: string,
		userId: string,
		content: string
	): Promise<IRoute> {
		const route = await this.findById(routeId)
		if (!route) {
			throw new Error('Route not found')
		}

		const comment = {
			user: new Types.ObjectId(userId),
			content,
			createdAt: new Date(),
		}

		const updatedRoute = await this.update(routeId, {
			$push: { comments: comment },
		})

		if (!updatedRoute) throw new Error('Failed to add comment')
		return updatedRoute
	}

	async removeComment(
		routeId: string,
		commentId: string,
		userId: string
	): Promise<IRoute> {
		const route = await this.findById(routeId)
		if (!route) {
			throw new Error('Route not found')
		}

		const comment = route.comments.find((c) => c._id?.toString() === commentId)
		if (!comment) {
			throw new Error('Comment not found')
		}

		if (!comment.isOwner(userId)) {
			throw new Error('Not authorized to remove this comment')
		}

		const updatedRoute = await this.update(routeId, {
			$pull: { comments: { _id: new Types.ObjectId(commentId) } },
		})

		if (!updatedRoute) throw new Error('Failed to remove comment')
		return updatedRoute
	}

	async getRoutesByUser(userId: string, page: number = 1, limit: number = 10) {
		return this.findWithPagination({ creator: userId }, page, limit, {
			sort: { createdAt: -1 },
		})
	}

	async searchRoutes(query: string, page: number = 1, limit: number = 10) {
		const searchRegex = new RegExp(query, 'i')
		return this.findWithPagination(
			{
				$or: [
					{ title: searchRegex },
					{ description: searchRegex },
					{ tags: searchRegex },
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
		radiusKm: number = 10,
		page: number = 1,
		limit: number = 10
	) {
		const earthRadiusKm = 6371
		return this.findWithPagination(
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
			page,
			limit,
			{ sort: { createdAt: -1 } }
		)
	}

	async getRoutes(page: number, limit: number) {
		const skip = (page - 1) * limit

		const routes = await Route.find({ visibility: 'public' })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)

		return {
			data: routes,
			page,
			limit,
		}
	}

	async getRoute(routeId: string): Promise<IRoute> {
		const route = await this.findById(routeId)
		if (!route) {
			throw new Error('Route not found')
		}
		return route
	}
}
