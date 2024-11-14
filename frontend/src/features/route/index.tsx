import { APIProvider } from '@vis.gl/react-google-maps'
import { RouteData, WaypointType } from './types'
import { useCreateRoute } from './hooks/use-create-route'
import toast from 'react-hot-toast'
import { RouteMap } from '@/components/maps/route-map'
import { RouteForm } from './components/route-form'
import { RouteFormValues } from './schemas/route-form-schema'
import { useRouteState } from './hooks/use-route-state'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const MapContent = () => {
	const {
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
	} = useRouteState()

	const { mutate: createRoute, isPending } = useCreateRoute()

	const handleSubmit = async (formData: RouteFormValues) => {
		if (
			!startPoint?.geometry?.location ||
			!endPoint?.geometry?.location ||
			!directions
		) {
			toast.error('Please complete the route details')
			return
		}

		try {
			const routeData: RouteData = {
				title: formData.title,
				description: formData.description,
				startPoint: {
					lat: startPoint.geometry.location.lat(),
					lng: startPoint.geometry.location.lng(),
				},
				endPoint: {
					lat: endPoint.geometry.location.lat(),
					lng: endPoint.geometry.location.lng(),
				},
				waypoints: waypoints
					.filter(
						(wp): wp is WaypointType =>
							wp !== null && wp.place.geometry?.location !== undefined
					)
					.map((wp) => ({
						lat: wp.place.geometry!.location!.lat(),
						lng: wp.place.geometry!.location!.lng(),
					})),
				travelMode,
				totalDistance: directions.routes[0].legs.reduce(
					(total, leg) => total + (leg.distance?.value || 0),
					0
				),
				totalTime: directions.routes[0].legs.reduce(
					(total, leg) => total + (leg.duration?.value || 0),
					0
				),
				visibility: formData.visibility,
				tags: formData.tags
					? formData.tags.split(',').map((tag) => tag.trim().toLowerCase())
					: [],
			}

			createRoute(routeData)
		} catch (error) {
			console.error('Error preparing route data:', error)
			toast.error('Failed to create route')
		}
	}

	return (
		<div className='flex h-screen'>
			<RouteForm
				startPoint={startPoint}
				onStartPointChange={setStartPoint}
				endPoint={endPoint}
				onEndPointChange={setEndPoint}
				waypoints={waypoints}
				onAddWaypoint={addWaypoint}
				onRemoveWaypoint={removeWaypoint}
				onUpdateWaypoint={updateWaypoint}
				directions={directions}
				travelMode={travelMode}
				onTravelModeChange={setTravelMode}
				onSubmit={handleSubmit}
				isPending={isPending}
			/>

			<div className='flex-1'>
				<RouteMap
					startPoint={startPoint}
					endPoint={endPoint}
					waypoints={waypoints}
					travelMode={travelMode}
					onDirectionsChange={setDirections}
				/>
			</div>
		</div>
	)
}

export default function RouteCreator() {
	if (!GOOGLE_MAPS_API_KEY) {
		return <div>Please add your Google Maps API key to the .env file</div>
	}

	return (
		<APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
			<MapContent />
		</APIProvider>
	)
}
