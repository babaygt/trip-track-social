import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { routeApi } from '@/services/route'
import { RouteCard } from '../components/route-card'
import { CommentList } from '../components/comment-list'

export default function RoutePostPage() {
	const queryClient = useQueryClient()
	const { routeId } = useParams<{ routeId: string }>()
	const {
		data: route,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['route', routeId],
		queryFn: () => routeApi.getRoute(routeId!),
		enabled: !!routeId,
	})

	const handleCommentUpdate = () => {
		queryClient.invalidateQueries({ queryKey: ['route', routeId] })
		queryClient.invalidateQueries({ queryKey: ['routes'] })
	}

	if (isLoading) {
		return (
			<div className='text-center text-foreground h-screen flex items-center justify-center'>
				Loading...
			</div>
		)
	}

	if (error || !route) {
		return (
			<div className='text-center text-foreground h-screen flex items-center justify-center'>
				Error loading route
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background'>
			<div className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6'>
				<RouteCard route={route} />
				<div className='bg-background rounded-lg shadow p-6'>
					<CommentList route={route} onCommentUpdate={handleCommentUpdate} />
				</div>
			</div>
		</div>
	)
}
