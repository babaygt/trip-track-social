import { BaseService } from './base-service'
import { IRoute, Route } from '../models'

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
			$addToSet: { likes: userId },
		})

		if (!updatedRoute) throw new Error('Failed to like route')
		return updatedRoute
	}
}
