import { api } from '@/lib/axios'

interface RegisterData {
	name: string
	username: string
	email: string
	password: string
	bio?: string
}

interface LoginCredentials {
	email: string
	password: string
}

export const authApi = {
	register: async (userData: RegisterData) => {
		const response = await api.post('/users', {
			...userData,
			bio: userData.bio || '',
		})
		return response.data
	},

	login: async (credentials: LoginCredentials) => {
		const response = await api.post('/auth/login', credentials)
		return response.data
	},

	logout: async () => {
		const response = await api.post('/auth/logout')
		return response.data
	},
}
