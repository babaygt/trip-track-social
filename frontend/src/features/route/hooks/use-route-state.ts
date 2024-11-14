import { useState } from 'react'
import { WaypointType, TravelMode } from '../types'

export function useRouteState() {
	const [startPoint, setStartPoint] =
		useState<google.maps.places.PlaceResult | null>(null)
	const [endPoint, setEndPoint] =
		useState<google.maps.places.PlaceResult | null>(null)
	const [waypoints, setWaypoints] = useState<Array<WaypointType | null>>([])
	const [directions, setDirections] =
		useState<google.maps.DirectionsResult | null>(null)
	const [travelMode, setTravelMode] = useState<TravelMode>('DRIVING')

	const addWaypoint = () => {
		setWaypoints((prev) => [...prev, null])
	}

	const removeWaypoint = (index: number) => {
		setWaypoints((prev) => prev.filter((_, i) => i !== index))
	}

	const updateWaypoint = (
		index: number,
		place: google.maps.places.PlaceResult
	) => {
		if (!place.geometry?.location) return

		setWaypoints((prev) => {
			const next = [...prev]
			next[index] = {
				location: place.formatted_address || '',
				place: place,
			}
			return next
		})
	}

	return {
		startPoint,
		setStartPoint,
		endPoint,
		setEndPoint,
		waypoints,
		addWaypoint,
		removeWaypoint,
		updateWaypoint,
		directions,
		setDirections,
		travelMode,
		setTravelMode,
	}
}
