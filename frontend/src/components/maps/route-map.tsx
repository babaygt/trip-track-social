import { Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps'
import { useState, useEffect } from 'react'
import { TravelMode } from '@/features/route/types'

interface RouteMapProps {
	startPoint: google.maps.places.PlaceResult | null
	endPoint: google.maps.places.PlaceResult | null
	waypoints: Array<{
		location: string
		place: google.maps.places.PlaceResult
	} | null>
	travelMode: TravelMode
	onDirectionsChange?: (directions: google.maps.DirectionsResult) => void
}

export function RouteMap({
	startPoint,
	endPoint,
	waypoints,
	travelMode,
	onDirectionsChange,
}: RouteMapProps) {
	const map = useMap()
	const routesLib = useMapsLibrary('routes')
	const [directionsService, setDirectionsService] =
		useState<google.maps.DirectionsService | null>(null)
	const [directionsRenderer, setDirectionsRenderer] =
		useState<google.maps.DirectionsRenderer | null>(null)

	useEffect(() => {
		if (!routesLib || !map) return

		const renderer = new routesLib.DirectionsRenderer({
			map,
			suppressMarkers: false,
		})
		const service = new routesLib.DirectionsService()

		setDirectionsService(service)
		setDirectionsRenderer(renderer)

		return () => {
			renderer.setMap(null)
		}
	}, [routesLib, map])

	useEffect(() => {
		calculateRoute()
	}, [
		directionsService,
		directionsRenderer,
		startPoint,
		endPoint,
		waypoints,
		travelMode,
	])

	const calculateRoute = async () => {
		if (
			!directionsService ||
			!directionsRenderer ||
			!startPoint?.formatted_address ||
			!endPoint?.formatted_address
		) {
			return
		}

		try {
			const validWaypoints = waypoints
				.filter((wp) => wp !== null && wp.place.formatted_address)
				.map((wp) => ({
					location: wp!.place.formatted_address!,
					stopover: true,
				}))

			const request: google.maps.DirectionsRequest = {
				origin: startPoint.formatted_address,
				destination: endPoint.formatted_address,
				waypoints: validWaypoints,
				travelMode: travelMode as unknown as google.maps.TravelMode,
				optimizeWaypoints: true,
			}

			const response = await directionsService.route(request)
			directionsRenderer.setMap(map)
			directionsRenderer.setDirections(response)
			onDirectionsChange?.(response)

			if (response.routes[0].bounds) {
				map?.fitBounds(response.routes[0].bounds)
			}
		} catch (error) {
			console.error('Error calculating route:', error)
		}
	}

	return (
		<Map
			defaultCenter={{ lat: 52.52, lng: 13.405 }}
			defaultZoom={12}
			gestureHandling='greedy'
			className='w-full h-full'
			disableDefaultUI={false}
			mapTypeControl={true}
			zoomControl={true}
			scaleControl={true}
		/>
	)
}
