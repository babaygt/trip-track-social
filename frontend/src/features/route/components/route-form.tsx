import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { routeFormSchema, RouteFormValues } from '../schemas/route-form-schema'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LocationInput } from './location-input'
import { RouteDetails } from './route-details'
import { WaypointType, TRAVEL_MODES, TravelMode } from '../types'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'

interface RouteFormProps {
	startPoint: google.maps.places.PlaceResult | null
	onStartPointChange: (point: google.maps.places.PlaceResult) => void
	endPoint: google.maps.places.PlaceResult | null
	onEndPointChange: (point: google.maps.places.PlaceResult) => void
	waypoints: Array<WaypointType | null>
	onAddWaypoint: () => void
	onRemoveWaypoint: (index: number) => void
	onUpdateWaypoint: (
		index: number,
		place: google.maps.places.PlaceResult
	) => void
	directions: google.maps.DirectionsResult | null
	travelMode: TravelMode
	onTravelModeChange: (mode: TravelMode) => void
	onSubmit: (data: RouteFormValues) => void
	isPending: boolean
}

export function RouteForm({
	startPoint,
	onStartPointChange,
	endPoint,
	onEndPointChange,
	waypoints,
	onAddWaypoint,
	onRemoveWaypoint,
	onUpdateWaypoint,
	directions,
	travelMode,
	onTravelModeChange,
	onSubmit,
	isPending,
}: RouteFormProps) {
	const form = useForm<RouteFormValues>({
		resolver: zodResolver(routeFormSchema),
		defaultValues: {
			title: '',
			description: '',
			visibility: 'public',
			tags: '',
		},
	})

	const handleSubmit = (formData: RouteFormValues) => {
		if (!startPoint?.geometry?.location || !endPoint?.geometry?.location) {
			toast.error('Please complete the route details')
			return
		}
		onSubmit(formData)
	}

	return (
		<Card className='p-6 space-y-4 w-[400px] max-h-screen overflow-y-auto'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
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
						onPlaceSelect={onStartPointChange}
						value={startPoint?.formatted_address || ''}
					/>

					{waypoints.map((waypoint, index) => (
						<LocationInput
							key={index}
							inputId={`waypoint-${index}-input`}
							label={`Waypoint ${index + 1}`}
							placeholder={`Enter waypoint ${index + 1}`}
							onPlaceSelect={(place) => onUpdateWaypoint(index, place)}
							onRemove={() => onRemoveWaypoint(index)}
							value={waypoint?.place.formatted_address || ''}
						/>
					))}

					<Button
						type='button'
						onClick={onAddWaypoint}
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
						onPlaceSelect={onEndPointChange}
						value={endPoint?.formatted_address || ''}
					/>

					<div className='space-y-2'>
						<FormLabel>Travel Mode</FormLabel>
						<Select value={travelMode} onValueChange={onTravelModeChange}>
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
	)
}
