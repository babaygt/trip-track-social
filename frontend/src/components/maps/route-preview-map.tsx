import { Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'react'
import { RouteResponse } from '@/services/route'

interface RoutePreviewMapProps {
	route: RouteResponse
}

export function RoutePreviewMap({ route }: RoutePreviewMapProps) {
	const map = useMap()
	const routesLib = useMapsLibrary('routes')
	const [directionsRenderer, setDirectionsRenderer] =
		useState<google.maps.DirectionsRenderer | null>(null)

	useEffect(() => {
		if (!routesLib || !map) return

		const renderer = new routesLib.DirectionsRenderer({
			map,
			suppressMarkers: false,
		})
		setDirectionsRenderer(renderer)

		return () => {
			renderer.setMap(null)
		}
	}, [routesLib, map])

	useEffect(() => {
		if (!routesLib || !directionsRenderer) return

		const service = new routesLib.DirectionsService()
		const request: google.maps.DirectionsRequest = {
			origin: route.startPoint,
			destination: route.endPoint,
			waypoints: route.waypoints.map((wp) => ({
				location: { lat: wp.lat, lng: wp.lng },
				stopover: true,
			})),
			travelMode: route.travelMode as unknown as google.maps.TravelMode,
		}

		service.route(request, (result, status) => {
			if (status === 'OK' && result) {
				directionsRenderer.setDirections(result)
				if (result.routes[0].bounds) {
					map?.fitBounds(result.routes[0].bounds)
				}
			}
		})
	}, [directionsRenderer, route])

	return (
		<Map
			defaultCenter={{ lat: route.startPoint.lat, lng: route.startPoint.lng }}
			defaultZoom={12}
			gestureHandling='cooperative'
			className='w-full h-[200px] rounded-md'
			disableDefaultUI={true}
		/>
	)
}
