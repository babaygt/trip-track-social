import { useState, useEffect } from 'react'
import { RouteResponse } from '@/services/route'
import { useQuery } from '@tanstack/react-query'
import { routeApi } from '@/services/route'

export function useRouteStats(route: RouteResponse) {
	const { data: currentRoute } = useQuery({
		queryKey: ['route', route._id],
		queryFn: () => routeApi.getRoute(route._id),
		enabled: !!route._id,
	})

	const [commentCount, setCommentCount] = useState(route.comments?.length || 0)

	useEffect(() => {
		if (currentRoute) {
			setCommentCount(currentRoute.comments?.length || 0)
		}
	}, [currentRoute])

	return {
		commentCount,
	}
}
