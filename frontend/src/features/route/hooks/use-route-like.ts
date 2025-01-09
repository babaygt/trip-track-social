import { useState, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { routeApi } from '@/services/route'
import toast from 'react-hot-toast'
import { RouteResponse, Like } from '@/services/route'
import { useQueryClient } from '@tanstack/react-query'

export function useRouteLike(route: RouteResponse) {
	const { user } = useAuthStore()
	const queryClient = useQueryClient()
	const isUpdatingRef = useRef(false)
	const [isLiked, setIsLiked] = useState(() => {
		if (!user || !route?.likes) return false
		return route.likes.some((likeId: Like) => {
			const likeIdStr =
				typeof likeId === 'object' && '_id' in likeId
					? likeId._id
					: likeId.toString()
			return likeIdStr === user._id
		})
	})
	const [likeCount, setLikeCount] = useState(route?.likes?.length || 0)

	const handleLike = async () => {
		if (!user) {
			toast.error('You must be logged in to like a route')
			return
		}

		if (!route) {
			return
		}

		// Prevent multiple rapid clicks
		if (isUpdatingRef.current) {
			return
		}
		isUpdatingRef.current = true

		// Optimistically update UI and show toast immediately
		const previousIsLiked = isLiked
		const previousLikeCount = likeCount
		const newIsLiked = !isLiked
		setIsLiked(newIsLiked)
		setLikeCount(newIsLiked ? likeCount + 1 : likeCount - 1)
		toast.success(
			newIsLiked ? 'Route liked successfully' : 'Route unliked successfully'
		)

		try {
			const updatedRoute = newIsLiked
				? await routeApi.likeRoute(route._id, user._id)
				: await routeApi.unlikeRoute(route._id, user._id)

			// Update cache
			queryClient.setQueryData(['route', route._id], updatedRoute)
		} catch (error) {
			// Revert optimistic update on error
			setIsLiked(previousIsLiked)
			setLikeCount(previousLikeCount)
			console.error('Like error:', error)
			toast.error('Failed to update like status')
		} finally {
			// Allow next update after a small delay
			setTimeout(() => {
				isUpdatingRef.current = false
			}, 300)
		}
	}

	return {
		isLiked,
		likeCount,
		handleLike,
	}
}
