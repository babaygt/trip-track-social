import { TRAVEL_MODES, TravelMode } from '../types'

interface RouteDetailsProps {
	directions: google.maps.DirectionsResult
	travelMode: TravelMode
}

export const RouteDetails: React.FC<RouteDetailsProps> = ({
	directions,
	travelMode,
}) => {
	if (!directions || !directions.routes[0].legs.length) return null

	const totalDistance =
		Math.round(
			directions.routes[0].legs.reduce(
				(total, leg) => total + (leg.distance?.value || 0),
				0
			) / 100
		) / 10

	const totalDuration = Math.round(
		directions.routes[0].legs.reduce(
			(total, leg) => total + (leg.duration?.value || 0),
			0
		) / 60
	)

	return (
		<div className='mt-4 p-4 bg-background rounded-md space-y-2'>
			<p className='font-semibold text-foreground'>Route Summary:</p>
			<p className='text-foreground'>Total Distance: {totalDistance} km</p>
			<p className='text-foreground'>Total Duration: {totalDuration} minutes</p>
			<p className='text-foreground'>
				Travel Mode:{' '}
				{TRAVEL_MODES.find((mode) => mode.value === travelMode)?.label}
			</p>
		</div>
	)
}
