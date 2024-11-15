import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { routeApi } from '@/services/route'
import toast from 'react-hot-toast'
import { RouteResponse } from '@/services/route'

export function useRouteComments(
	route: RouteResponse,
	onCommentUpdate?: () => void
) {
	const { user } = useAuthStore()
	const [comments, setComments] = useState(route.comments || [])

	const addComment = async (content: string) => {
		if (!user) {
			toast.error('You must be logged in to comment')
			return
		}

		try {
			const updatedRoute = await routeApi.addComment(
				route._id,
				user._id,
				content
			)
			setComments(updatedRoute.comments)
			onCommentUpdate?.()
			toast.success('Comment added successfully')
		} catch (error) {
			console.error('Comment error:', error)
			toast.error('Failed to add comment')
		}
	}

	const removeComment = async (commentId: string) => {
		if (!user) return

		try {
			const updatedRoute = await routeApi.removeComment(
				route._id,
				commentId,
				user._id
			)
			setComments(updatedRoute.comments)
			onCommentUpdate?.()
			toast.success('Comment removed successfully')
		} catch (error) {
			console.error('Comment error:', error)
			toast.error('Failed to remove comment')
		}
	}

	return {
		comments,
		addComment,
		removeComment,
	}
}
