import { useState, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { routeApi } from '@/services/route'
import toast from 'react-hot-toast'
import { RouteResponse } from '@/services/route'
import { useQueryClient } from '@tanstack/react-query'

interface Comment {
	_id: string
	content: string
	user: {
		_id: string
		name: string
		username: string
		profilePicture?: string
	}
	createdAt: string
}

export function useRouteComments(
	route: RouteResponse,
	onCommentUpdate?: () => void
) {
	const { user } = useAuthStore()
	const queryClient = useQueryClient()
	const isUpdatingRef = useRef(false)
	const [comments, setComments] = useState<Comment[]>(route.comments || [])

	const addComment = async (content: string) => {
		if (!user) {
			toast.error('You must be logged in to comment')
			return
		}

		if (isUpdatingRef.current) {
			return
		}
		isUpdatingRef.current = true

		// Create optimistic comment
		const optimisticComment: Comment = {
			_id: Date.now().toString(), // Temporary ID
			content,
			user: {
				_id: user._id,
				name: user.name,
				username: user.username,
				profilePicture: user.profilePicture,
			},
			createdAt: new Date().toISOString(),
		}

		// Optimistically update UI and show toast
		setComments((prev) => [...prev, optimisticComment])
		toast.success('Comment added successfully')

		try {
			const updatedRoute = await routeApi.addComment(
				route._id,
				user._id,
				content
			)
			setComments(updatedRoute.comments)

			// Update cache
			queryClient.setQueryData(['route', route._id], updatedRoute)
			onCommentUpdate?.()
		} catch (error) {
			// Revert optimistic update
			setComments((prev) => prev.filter((c) => c._id !== optimisticComment._id))
			console.error('Comment error:', error)
			toast.error('Failed to add comment')
		} finally {
			setTimeout(() => {
				isUpdatingRef.current = false
			}, 300)
		}
	}

	const removeComment = async (commentId: string) => {
		if (!user) return

		if (isUpdatingRef.current) {
			return
		}
		isUpdatingRef.current = true

		// Optimistically update UI and show toast
		const previousComments = [...comments]
		setComments((prev) => prev.filter((c) => c._id !== commentId))
		toast.success('Comment removed successfully')

		try {
			const updatedRoute = await routeApi.removeComment(
				route._id,
				commentId,
				user._id
			)
			setComments(updatedRoute.comments)

			// Update cache
			queryClient.setQueryData(['route', route._id], updatedRoute)
			onCommentUpdate?.()
		} catch (error) {
			// Revert optimistic update
			setComments(previousComments)
			console.error('Comment error:', error)
			toast.error('Failed to remove comment')
		} finally {
			setTimeout(() => {
				isUpdatingRef.current = false
			}, 300)
		}
	}

	return {
		comments,
		addComment,
		removeComment,
	}
}
