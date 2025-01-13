import { useInfiniteQuery } from '@tanstack/react-query'
import { routeApi } from '@/services'
import { RouteCard } from './route-card'

export function RouteFeed() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useInfiniteQuery({
			queryKey: ['routes'],
			queryFn: ({ pageParam }) => routeApi.getRoutes(pageParam),
			initialPageParam: 1,
			getNextPageParam: (lastPage, pages) => {
				if (lastPage.data.length < 12) return undefined
				return pages.length + 1
			},
		})

	if (status === 'pending')
		return (
			<div className='text-center text-foreground h-[50vh] flex items-center justify-center'>
				Loading...
			</div>
		)
	if (status === 'error')
		return (
			<div className='text-center text-foreground h-[50vh] flex items-center justify-center'>
				Error loading routes
			</div>
		)

	return (
		<div className='space-y-8'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{data.pages.map((page) =>
					page.data.map((route) => (
						<div key={route._id}>
							<RouteCard route={route} />
						</div>
					))
				)}
			</div>

			{hasNextPage && (
				<div className='mt-12 text-center'>
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
	)
}
