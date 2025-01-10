import { type FC } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileRoutes } from './profile-routes'
import { type User } from '@/stores/auth-store'
import { useInfiniteQuery } from '@tanstack/react-query'
import { routeApi, type RouteResponse } from '@/services/route'
import { RouteCard } from '@/features/route/components/route-card'
import { Loader2 } from 'lucide-react'

interface ProfileContentProps {
	user: User
}

export const ProfileContent: FC<ProfileContentProps> = ({ user }) => {
	const {
		data: routes,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery({
		queryKey: ['routes'],
		queryFn: ({ pageParam }) => routeApi.getRoutes(pageParam),
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => {
			if (lastPage.data.length < 12) return undefined
			return pages.length + 1
		},
	})

	// Filter liked routes from all routes
	const likedRoutes =
		routes?.pages.flatMap((page) =>
			page.data.filter((route) =>
				route.likes.some((like) =>
					typeof like === 'object' && '_id' in like
						? like._id === user._id
						: like === user._id
				)
			)
		) || []

	// Filter bookmarked routes from all routes
	const bookmarkedRoutes =
		routes?.pages.flatMap((page) =>
			page.data.filter((route) => user.bookmarks?.includes(route._id))
		) || []

	return (
		<div className='w-full max-w-4xl'>
			<Tabs defaultValue='routes' className='w-full'>
				<TabsList className='w-full justify-start mb-6 h-12 bg-background'>
					<TabsTrigger value='routes' className='flex-1'>
						Routes
					</TabsTrigger>
					<TabsTrigger value='likes' className='flex-1'>
						Likes
					</TabsTrigger>
					<TabsTrigger value='bookmarks' className='flex-1'>
						Bookmarks
					</TabsTrigger>
				</TabsList>

				<TabsContent value='routes'>
					<ProfileRoutes user={user} />
				</TabsContent>

				<TabsContent value='likes'>
					{status === 'pending' ? (
						<div className='flex justify-center p-8'>
							<Loader2 className='h-8 w-8 animate-spin text-primary' />
						</div>
					) : status === 'error' ? (
						<div className='text-center p-8 text-muted-foreground'>
							Error loading liked routes
						</div>
					) : !likedRoutes.length ? (
						<div className='text-center p-8 text-muted-foreground'>
							No liked routes yet
						</div>
					) : (
						<div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{likedRoutes.map((route: RouteResponse) => (
									<div key={route._id}>
										<RouteCard route={route} />
									</div>
								))}
							</div>

							{hasNextPage && (
								<div className='mt-8 text-center'>
									<button
										onClick={() => fetchNextPage()}
										disabled={isFetchingNextPage}
										className='px-8 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-50'
									>
										{isFetchingNextPage ? 'Loading more...' : 'Load More'}
									</button>
								</div>
							)}
						</div>
					)}
				</TabsContent>

				<TabsContent value='bookmarks'>
					{!bookmarkedRoutes.length ? (
						<div className='text-center p-8 text-muted-foreground'>
							No bookmarked routes yet
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{bookmarkedRoutes.map((route: RouteResponse) => (
								<div key={route._id}>
									<RouteCard route={route} />
								</div>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	)
}
