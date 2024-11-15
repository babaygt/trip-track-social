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

	if (status === 'pending') return <div>Loading...</div>
	if (status === 'error') return <div>Error loading routes</div>

	return (
		<div className='max-w-7xl mx-auto'>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
				{data.pages.map((page) =>
					page.data.map((route) => (
						<div key={route._id} className='flex'>
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
