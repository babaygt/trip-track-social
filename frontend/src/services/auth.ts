import { api } from '@/lib/axios'
import { AxiosError } from 'axios'

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
		try {
			const response = await api.post('/users', {
				...userData,
				bio: userData.bio || '',
			})
			return response.data
		} catch (error) {
			if (error instanceof AxiosError && error.response?.data) {
				throw new Error(error.response.data.message || 'Registration failed')
			}
			throw new Error('An unexpected error occurred')
		}
	},

	login: async (credentials: LoginCredentials) => {
		try {
			const response = await api.post('/auth/login', credentials)
			return response.data
		} catch (error) {
			if (error instanceof AxiosError && error.response?.data) {
				throw new Error(error.response.data.message || 'Login failed')
			}
			throw new Error('An unexpected error occurred')
		}
	},

	logout: async () => {
		try {
			const response = await api.post('/auth/logout')
			return response.data
		} catch (error) {
			if (error instanceof AxiosError && error.response?.data) {
				throw new Error(error.response.data.message || 'Logout failed')
			}
			throw new Error('An unexpected error occurred')
		}
	},
}
