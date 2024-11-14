import { api } from '@/lib/axios'
import type { User } from '@/stores/auth-store'

export const userApi = {
	getUserByUsername: async (username: string) => {
		const response = await api.get(`users/find/${username}`)
		return response.data as User
	},
}
