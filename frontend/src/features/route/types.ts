export interface WaypointType {
	location: string
	place: google.maps.places.PlaceResult
}

export const TRAVEL_MODES = [
	{ value: 'DRIVING', label: '🚗 Driving' },
	{ value: 'WALKING', label: '🚶 Walking' },
	{ value: 'BICYCLING', label: '🚲 Bicycling' },
	{ value: 'TRANSIT', label: '🚌 Transit' },
] as const

export type TravelMode = (typeof TRAVEL_MODES)[number]['value']

export interface RouteData {
	title: string
	description: string
	startPoint: {
		lat: number
		lng: number
	}
	endPoint: {
		lat: number
		lng: number
	}
	waypoints: Array<{
		lat: number
		lng: number
	}>
	travelMode: TravelMode
	totalDistance: number
	totalTime: number
	visibility: 'public' | 'private' | 'followers'
	tags: string[]
}
