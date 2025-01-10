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

		// Optimistically update state
		setUser({
			...user,
			following: newIsFollowing
				? [...(user.following || []), targetUser._id]
				: (user.following || []).filter((id) => {
						const followingIdStr =
							typeof id === 'object' && '_id' in id
								? (id as { _id: string })._id
								: id.toString()
						return followingIdStr !== targetUser._id
				  }),
		})

		// Show optimistic toast
		toast.success(
			newIsFollowing
				? `You are now following ${targetUser.username}`
				: `You unfollowed ${targetUser.username}`
		)

		try {
			// Make API call to update follow status
			if (newIsFollowing) {
				await userApi.followUser(user._id, targetUser._id)
			} else {
				await userApi.unfollowUser(user._id, targetUser._id)
			}

			// Invalidate user queries to refetch updated data
			queryClient.invalidateQueries({
				queryKey: ['profile', targetUser.username],
			})
			queryClient.invalidateQueries({ queryKey: ['profile', user.username] })
			queryClient.invalidateQueries({ queryKey: ['user', targetUser.username] })
			queryClient.invalidateQueries({ queryKey: ['user', user.username] })
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>
			console.error('Follow error:', error)

			if (axiosError.response?.status === 400) {
				// If we get a 400, the state is already what we want
				return
			}

			// Revert state on error
			setUser({
				...user,
				following: newIsFollowing
					? (user.following || []).filter((id) => id !== targetUser._id)
					: [...(user.following || []), targetUser._id],
			})
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
