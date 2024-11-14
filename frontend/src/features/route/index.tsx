import { useState, useEffect } from 'react'
import {
	APIProvider,
	Map,
	useMapsLibrary,
	useMap,
} from '@vis.gl/react-google-maps'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LocationInput } from './components/location-input'
import { RouteDetails } from './components/route-details'
import { WaypointType, TRAVEL_MODES, TravelMode, RouteData } from './types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useCreateRoute } from './hooks/use-create-route'
import toast from 'react-hot-toast'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const routeFormSchema = z.object({
	title: z
		.string()
		.min(2, { message: 'Title must be at least 2 characters.' })
		.max(100, { message: 'Title cannot exceed 100 characters.' }),
	description: z
		.string()
		.min(10, { message: 'Description must be at least 10 characters.' })
		.max(2000, { message: 'Description cannot exceed 2000 characters.' }),
	visibility: z.enum(['public', 'private', 'followers'] as const),
	tags: z.string().optional(),
})

type RouteFormValues = z.infer<typeof routeFormSchema>

const MapContent = () => {
	const [startPoint, setStartPoint] =
		useState<google.maps.places.PlaceResult | null>(null)
	const [endPoint, setEndPoint] =
		useState<google.maps.places.PlaceResult | null>(null)
	const [waypoints, setWaypoints] = useState<Array<WaypointType | null>>([])
	const [directions, setDirections] =
		useState<google.maps.DirectionsResult | null>(null)
	const [travelMode, setTravelMode] = useState<TravelMode>('DRIVING')

	const map = useMap()
	const routesLib = useMapsLibrary('routes')
	const [directionsService, setDirectionsService] =
		useState<google.maps.DirectionsService | null>(null)
	const [directionsRenderer, setDirectionsRenderer] =
		useState<google.maps.DirectionsRenderer | null>(null)

	const form = useForm<RouteFormValues>({
		resolver: zodResolver(routeFormSchema),
		defaultValues: {
			title: '',
			description: '',
			visibility: 'public',
			tags: '',
		},
	})

	const { mutate: createRoute, isPending } = useCreateRoute()

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

	const addWaypoint = () => {
		setWaypoints((prev) => [...prev, null])
	}

	const removeWaypoint = (index: number) => {
		const newWaypoints = waypoints.filter((_, i) => i !== index)
		setWaypoints(newWaypoints)
	}

	const updateWaypoint = (
		index: number,
		place: google.maps.places.PlaceResult
	) => {
		console.log('Updating waypoint:', index, place)
		if (!place.geometry || !place.geometry.location) {
			console.error('Invalid place data for waypoint')
			return
		}

		const newWaypoints = [...waypoints]
		newWaypoints[index] = {
			location: place.formatted_address || '',
			place: place,
		}
		setWaypoints(newWaypoints)
	}

	const calculateRoute = async () => {
		if (
			!directionsService ||
			!directionsRenderer ||
			!startPoint?.formatted_address ||
			!endPoint?.formatted_address
		) {
			console.log('Missing required data for route calculation:', {
				hasService: !!directionsService,
				hasRenderer: !!directionsRenderer,
				startPoint: startPoint?.formatted_address,
				endPoint: endPoint?.formatted_address,
			})
			return
		}

		try {
			const validWaypoints = waypoints
				.filter(
					(wp): wp is WaypointType =>
						wp !== null && wp.place && wp.place.formatted_address !== undefined
				)
				.map((wp) => ({
					location: wp.place.formatted_address,
					stopover: true,
				}))

			console.log('Calculating route with waypoints:', validWaypoints)

			const request: google.maps.DirectionsRequest = {
				origin: startPoint.formatted_address,
				destination: endPoint.formatted_address,
				waypoints: validWaypoints,
				travelMode: google.maps.TravelMode[travelMode],
				optimizeWaypoints: true,
			}

			const response = await directionsService.route(request)
			directionsRenderer.setMap(map)
			directionsRenderer.setDirections(response)
			setDirections(response)

			if (response.routes[0].bounds) {
				map?.fitBounds(response.routes[0].bounds)
			}
		} catch (error) {
			console.error('Error calculating route:', error)
		}
	}

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

	const onSubmit = async (formData: RouteFormValues) => {
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

			console.log('Submitting route data:', routeData)
			createRoute(routeData)
		} catch (error) {
			console.error('Error preparing route data:', error)
			toast.error('Failed to create route')
		}
	}

	return (
		<div className='flex h-screen'>
			<Card className='w-96 p-4 m-4 space-y-4 h-fit overflow-y-auto max-h-screen'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder='Enter route title' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<LocationInput
							inputId='start-point-input'
							label='Start Point'
							placeholder='Enter start point'
							onPlaceSelect={setStartPoint}
						/>

						{waypoints.map((_, index) => (
							<LocationInput
								key={index}
								inputId={`waypoint-input-${index}`}
								label={`Waypoint ${index + 1}`}
								placeholder={`Enter waypoint ${index + 1}`}
								onPlaceSelect={(place) => updateWaypoint(index, place)}
								onRemove={() => removeWaypoint(index)}
							/>
						))}

						<Button
							type='button'
							onClick={addWaypoint}
							className='w-full flex items-center gap-2'
							variant='outline'
						>
							<Plus className='h-4 w-4' />
							Add Waypoint
						</Button>

						<LocationInput
							inputId='end-point-input'
							label='End Point'
							placeholder='Enter end point'
							onPlaceSelect={setEndPoint}
						/>

						<div className='space-y-2'>
							<FormLabel>Travel Mode</FormLabel>
							<Select
								value={travelMode}
								onValueChange={(value: TravelMode) => setTravelMode(value)}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Select travel mode' />
								</SelectTrigger>
								<SelectContent>
									{TRAVEL_MODES.map((mode) => (
										<SelectItem key={mode.value} value={mode.value}>
											{mode.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Describe your route'
											className='resize-none'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='visibility'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Visibility</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select visibility' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='public'>Public</SelectItem>
											<SelectItem value='private'>Private</SelectItem>
											<SelectItem value='followers'>Followers Only</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='tags'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tags</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter tags separated by commas'
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Add tags separated by commas (e.g., scenic, mountain, city)
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{directions && (
							<RouteDetails directions={directions} travelMode={travelMode} />
						)}

						<Button type='submit' className='w-full' disabled={isPending}>
							{isPending ? 'Creating Route...' : 'Save Route'}
						</Button>
					</form>
				</Form>
			</Card>

			<div className='flex-1'>
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
