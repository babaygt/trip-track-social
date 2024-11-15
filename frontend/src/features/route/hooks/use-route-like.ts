import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { routeApi } from '@/services/route'
import toast from 'react-hot-toast'
import { RouteResponse, Like } from '@/services/route'

export function useRouteLike(route: RouteResponse) {
	const { user } = useAuthStore()
	const [isLiked, setIsLiked] = useState(() => {
		if (!user) return false
		return route.likes.some((likeId: Like) => {
			const likeIdStr =
				typeof likeId === 'object' && '_id' in likeId
					? likeId._id
					: likeId.toString()
			return likeIdStr === user._id
		})
	})
	const [likeCount, setLikeCount] = useState(route.likes.length)

	const handleLike = async () => {
		if (!user) {
			toast.error('You must be logged in to like a route')
			return
		}

		try {
			let updatedRoute
			if (isLiked) {
				updatedRoute = await routeApi.unlikeRoute(route._id, user._id)
				setIsLiked(false)
				toast.success('Route unliked successfully')
			} else {
				updatedRoute = await routeApi.likeRoute(route._id, user._id)
				setIsLiked(true)
				toast.success('Route liked successfully')
			}
			setLikeCount(updatedRoute.likes.length)
		} catch (error) {
			console.error('Like error:', error)
			toast.error('Failed to update like status')
		}
	}

	return {
		isLiked,
		likeCount,
		handleLike,
	}
}
