import { APIProvider } from '@vis.gl/react-google-maps'
import { RouteData, WaypointType } from './types'
import { useCreateRoute } from './hooks/use-create-route'
import toast from 'react-hot-toast'
import { RouteMap } from '@/components/maps/route-map'
import { RouteForm } from './components/route-form'
import { RouteFormValues } from './schemas/route-form-schema'
import { useRouteState } from './hooks/use-route-state'
import { useAuthStore } from '@/stores/auth-store'
import { LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'

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

	const { user } = useAuthStore()

	if (!user) {
		return (
			<div className='min-h-[400px] flex flex-col items-center justify-center p-8 space-y-6 bg-gradient-to-b from-background to-muted rounded-lg shadow-lg'>
				<div className='relative'>
					<div className='absolute -inset-1 bg-gradient-to-r from-primary to-secondary blur opacity-30 rounded-lg'></div>
					<div className='relative bg-background p-6 rounded-lg shadow-xl'>
						<h2 className='text-2xl font-bold text-center mb-4'>
							Authentication Required
						</h2>
						<p className='text-muted-foreground text-center mb-6'>
							Please sign in to create and share your travel routes
						</p>
						<div className='flex justify-center'>
							<Link
								to='/login'
								className='inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
							>
								<LogIn className='w-5 h-5 mr-2' />
								Sign In
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
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
