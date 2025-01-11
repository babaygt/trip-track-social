import { useRef } from 'react'
import { useAuthStore, User } from '@/stores/auth-store'
import { userApi } from '@/services/user'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function useUserFollow(targetUser: User) {
	const { user, setUser } = useAuthStore()
	const queryClient = useQueryClient()
	const isUpdatingRef = useRef(false)

	const isFollowing =
		user?.following?.some((followingId) => {
			const followingIdStr =
				typeof followingId === 'object' && '_id' in followingId
					? (followingId as { _id: string })._id
					: followingId.toString()
			return followingIdStr === targetUser?._id
		}) || false

	const handleFollow = async () => {
		if (!user) {
			toast.error('Please log in to follow users')
			return
		}

		if (!targetUser) {
			return
		}

		// Prevent multiple rapid clicks
		if (isUpdatingRef.current) {
			return
		}
		isUpdatingRef.current = true

		const newIsFollowing = !isFollowing

		try {
			// Make API call first
			const response = newIsFollowing
				? await userApi.followUser(user._id, targetUser._id)
				: await userApi.unfollowUser(user._id, targetUser._id)

			// Update auth store with server response
			setUser(response)

			// Update cache with server response
			queryClient.setQueryData(['user', user.username], response)
			queryClient.setQueryData(['profile', user.username], response)

			// Invalidate target user queries to trigger a refetch
			queryClient.invalidateQueries({
				queryKey: ['user', targetUser.username],
				exact: true,
			})
			queryClient.invalidateQueries({
				queryKey: ['profile', targetUser.username],
				exact: true,
			})
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>
			console.error('Follow error:', error)

			if (axiosError.response?.status === 400) {
				// If we get a 400, refetch both users to get the correct state
				queryClient.invalidateQueries({
					queryKey: ['user', targetUser.username],
					exact: true,
				})
				queryClient.invalidateQueries({
					queryKey: ['profile', targetUser.username],
					exact: true,
				})
				queryClient.invalidateQueries({
					queryKey: ['user', user.username],
					exact: true,
				})
				queryClient.invalidateQueries({
					queryKey: ['profile', user.username],
					exact: true,
				})
				return
			}

			toast.error('Failed to update follow status')
		} finally {
			// Allow next update after a small delay
			setTimeout(() => {
				isUpdatingRef.current = false
			}, 300)
		}
	}

	return {
		isFollowing,
		handleFollow,
	}
}
