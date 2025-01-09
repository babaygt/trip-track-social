import { useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { routeApi } from '@/services/route'
import toast from 'react-hot-toast'
import { RouteResponse } from '@/services/route'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function useRouteBookmark(route: RouteResponse) {
	const { user, setUser } = useAuthStore()
	const queryClient = useQueryClient()
	const isUpdatingRef = useRef(false)

	const isBookmarked =
		user?.bookmarks?.some((bookmarkId) => {
			const bookmarkIdStr =
				typeof bookmarkId === 'object' && '_id' in bookmarkId
					? (bookmarkId as { _id: string })._id
					: bookmarkId.toString()
			return bookmarkIdStr === route?._id
		}) || false

	const handleBookmark = async () => {
		if (!user) {
			toast.error('Please log in to bookmark routes')
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

		const newIsBookmarked = !isBookmarked

		// Optimistically update state
		setUser({
			...user,
			bookmarks: newIsBookmarked
				? [...(user.bookmarks || []), route._id]
				: (user.bookmarks || []).filter((id) => {
						const bookmarkIdStr =
							typeof id === 'object' && '_id' in id
								? (id as { _id: string })._id
								: id.toString()
						return bookmarkIdStr !== route._id
				  }),
		})

		// Show optimistic toast
		toast.success(
			newIsBookmarked
				? 'Route added to your bookmarks'
				: 'Route removed from your bookmarks'
		)

		try {
			// Make API call to update bookmark status
			if (newIsBookmarked) {
				await routeApi.addBookmark(route._id, user._id)
			} else {
				await routeApi.removeBookmark(route._id, user._id)
			}

			// Update route cache directly
			queryClient.setQueryData(
				['route', route._id],
				(oldRoute: RouteResponse | undefined) => {
					if (!oldRoute) return oldRoute
					return {
						...oldRoute,
						bookmarks: newIsBookmarked
							? [...(oldRoute.bookmarks || []), user._id]
							: (oldRoute.bookmarks || []).filter((id) => id !== user._id),
					}
				}
			)
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>
			console.error('Bookmark error:', error)

			if (axiosError.response?.status === 400) {
				// If we get a 400, the state is already what we want
				return
			}

			// Revert state on error
			setUser({
				...user,
				bookmarks: newIsBookmarked
					? (user.bookmarks || []).filter((id) => id !== route._id)
					: [...(user.bookmarks || []), route._id],
			})
			toast.error('Failed to update bookmark status')
		} finally {
			// Allow next update after a small delay
			setTimeout(() => {
				isUpdatingRef.current = false
			}, 300)
		}
	}

	return {
		isBookmarked,
		handleBookmark,
	}
}
