import { api } from '@/lib/axios'
import type { User } from '@/stores/auth-store'

interface UpdateProfileData {
	name?: string
	bio?: string
	profilePicture?: string
}

export const userApi = {
	updateProfile: async (userId: string, data: UpdateProfileData) => {
		const response = await api.patch(`users/${userId}/profile`, data)
		return response.data as User
	},

	getUserByUsername: async (username: string) => {
		const response = await api.get(`users/find/${username}`)
		return response.data as User
	},

	followUser: async (userId: string, targetUserId: string) => {
		const response = await api.post(`users/${userId}/follow/${targetUserId}`)
		return response.data as User
	},

	unfollowUser: async (userId: string, targetUserId: string) => {
		const response = await api.delete(`users/${userId}/follow/${targetUserId}`)
		return response.data as User
	},

	getFollowers: async (userId: string) => {
		const response = await api.get(`users/${userId}/followers`)
		return response.data as User[]
	},

	getFollowing: async (userId: string) => {
		const response = await api.get(`users/${userId}/following`)
		return response.data as User[]
	},
}
