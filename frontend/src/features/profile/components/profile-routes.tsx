import { useInfiniteQuery } from '@tanstack/react-query'
import { routeApi } from '@/services'
import { RouteCard } from '@/features/route/components/route-card'
import { Loader2 } from 'lucide-react'
import { User } from '@/stores/auth-store'

interface ProfileRoutesProps {
	user: User
}

export function ProfileRoutes({ user }: ProfileRoutesProps) {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useInfiniteQuery({
			queryKey: ['userRoutes', user._id],
			queryFn: ({ pageParam }) => routeApi.getUserRoutes(user._id, pageParam),
			initialPageParam: 1,
			getNextPageParam: (lastPage, pages) => {
				if (lastPage.data.length < 12) return undefined
				return pages.length + 1
			},
		})

	if (status === 'pending') {
		return (
			<div className='flex justify-center p-8'>
				<Loader2 className='h-8 w-8 animate-spin text-primary' />
			</div>
		)
	}

	if (!data?.pages[0].data.length) {
		return (
			<div className='text-center p-8 text-muted-foreground'>
				No routes created yet
			</div>
		)
	}

	return (
		<div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{data.pages.map((page) =>
					page.data.map((route) => (
						<div key={route._id}>
							<RouteCard route={route} />
						</div>
					))
				)}
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
	)
}
