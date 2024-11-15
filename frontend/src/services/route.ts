import { RouteData } from '@/features/route/types'
import { api } from '@/lib/axios'

export interface CreateRouteDto extends RouteData {
	creator: string
}

export type Like =
	| {
			_id: string
	  }
	| string

export interface RouteResponse {
	_id: string
	title: string
	creator: {
		_id: string
		username: string
		profilePicture?: string
		name: string
	}
	startPoint: {
		lat: number
		lng: number
	}
	endPoint: {
		lat: number
		lng: number
	}
	waypoints: Array<{
		lat: number
		lng: number
	}>
	travelMode: string
	description: string
	totalDistance: number
	totalTime: number
	visibility: 'public' | 'private' | 'followers'
	tags: string[]
	likes: Like[]
	comments: {
		_id: string
		content: string
		user: {
			_id: string
			name: string
			username: string
			profilePicture?: string
		}
		createdAt: string
	}[]
	createdAt: string
	updatedAt: string
}

export const routeApi = {
	createRoute: async (data: CreateRouteDto) => {
		const response = await api.post<RouteResponse>('/routes', data)
		return response.data
	},

	getUserRoutes: async (userId: string, page = 1, limit = 10) => {
		const response = await api.get<{ data: RouteResponse[] }>(
			`/routes/user/${userId}`,
			{
				params: { page, limit },
			}
		)
		return response.data
	},

	searchRoutes: async (query: string, page = 1, limit = 10) => {
		const response = await api.get<{ data: RouteResponse[] }>(
			'/routes/search',
			{
				params: { q: query, page, limit },
			}
		)
		return response.data
	},

	getNearbyRoutes: async (
		lat: number,
		lng: number,
		radius = 10,
		page = 1,
		limit = 10
	) => {
		const response = await api.get<{ data: RouteResponse[] }>(
			'/routes/nearby',
			{
				params: { lat, lng, radius, page, limit },
			}
		)
		return response.data
	},

	getRoutes: async (page = 1, limit = 12) => {
		const response = await api.get<{ data: RouteResponse[] }>('/routes', {
			params: { page, limit },
		})
		return response.data
	},

	getRoute: async (routeId: string) => {
		const response = await api.get<RouteResponse>(`/routes/find/${routeId}`)
		return response.data
	},

	likeRoute: async (routeId: string, userId: string) => {
		const response = await api.post(`/routes/${routeId}/like/${userId}`)
		return response.data
	},

	unlikeRoute: async (routeId: string, userId: string) => {
		const response = await api.delete(`/routes/${routeId}/like/${userId}`)
		return response.data
	},

	addComment: async (routeId: string, userId: string, content: string) => {
		const response = await api.post(`/routes/${routeId}/comments`, {
			userId,
			content,
		})
		return response.data
	},

	removeComment: async (routeId: string, commentId: string, userId: string) => {
		const response = await api.delete(
			`/routes/${routeId}/comments/${commentId}`,
			{
				data: { userId },
			}
		)
		return response.data
	},
}
