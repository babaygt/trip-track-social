import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { routeApi } from '@/services/route'
import toast from 'react-hot-toast'
import { RouteResponse } from '@/services/route'

type BookmarkError = Error & {
	response?: {
		data?: {
			message?: string
		}
	}
}

export function useRouteBookmark(route: RouteResponse) {
	const { user } = useAuthStore()
	const [isBookmarked, setIsBookmarked] = useState(() => {
		if (!user?.bookmarks) return false
		return user.bookmarks.some((bookmarkId) => {
			const bookmarkIdStr =
				typeof bookmarkId === 'object' && '_id' in bookmarkId
					? (bookmarkId as { _id: string })._id
					: bookmarkId.toString()
			return bookmarkIdStr === route._id
		})
	})

	const handleBookmark = async () => {
		if (!user) {
			toast.error('Please log in to bookmark routes', {
				duration: 3000,
				icon: '🔒',
			})
			return
		}

		try {
			if (isBookmarked) {
				await routeApi.removeBookmark(route._id, user._id)
				setIsBookmarked(false)
				toast.success('Route removed from your bookmarks', {
					duration: 2000,
					icon: '🗑️',
				})
			} else {
				const response = await routeApi.addBookmark(route._id, user._id)
				if (
					response.bookmarks?.some((bookmark) => {
						const bookmarkId =
							typeof bookmark === 'object' && '_id' in bookmark
								? (bookmark as { _id: string })._id
								: bookmark.toString()
						return bookmarkId === route._id
					})
				) {
					setIsBookmarked(true)
					toast.success('Route added to your bookmarks')
				}
			}
		} catch (error: unknown) {
			const err = error as BookmarkError
			console.error('Bookmark error:', err)
			if (err?.response?.data?.message === 'Route already bookmarked') {
				setIsBookmarked(true)
				toast.error('This route is already in your bookmarks', {
					duration: 3000,
					icon: '⚠️',
				})
			} else {
				toast.error('Failed to update bookmark status. Please try again.', {
					duration: 3000,
					icon: '❌',
				})
			}
		}
	}

	return {
		isBookmarked,
		handleBookmark,
	}
}
