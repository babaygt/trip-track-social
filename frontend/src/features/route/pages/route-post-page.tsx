import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { routeApi } from '@/services/route'
import { RouteCard } from '../components/route-card'

export default function RoutePostPage() {
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

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (error || !route) {
		return <div>Error loading route</div>
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<RouteCard route={route} />
			</div>
		</div>
	)
}
