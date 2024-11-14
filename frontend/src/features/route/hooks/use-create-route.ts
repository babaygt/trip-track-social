import { useMutation } from '@tanstack/react-query'
import { routeApi } from '@/services/'
import { RouteData } from '../types'
import { useAuthStore } from '@/stores/auth-store'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export function useCreateRoute() {
	const { user } = useAuthStore()
	const navigate = useNavigate()

	return useMutation({
		mutationFn: async (data: RouteData) => {
			if (!user) {
				throw new Error('You must be logged in to create a route')
			}

			return routeApi.createRoute({
				...data,
				creator: user._id,
			})
		},
		onSuccess: (data) => {
			toast.success('Route created successfully!')
			navigate(`/routes/${data._id}`)
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : 'Failed to create route'
			)
		},
	})
}
