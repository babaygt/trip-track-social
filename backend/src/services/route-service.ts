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
}
