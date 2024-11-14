import { useEffect, useRef } from 'react'
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { FormLabel } from '@/components/ui/form'

interface LocationInputProps {
	onPlaceSelect: (place: google.maps.places.PlaceResult) => void
	placeholder: string
	onRemove?: () => void
	inputId: string
	label?: string
}

export const LocationInput: React.FC<LocationInputProps> = ({
	onPlaceSelect,
	placeholder,
	onRemove,
	inputId,
	label,
}) => {
	const map = useMap()
	const places = useMapsLibrary('places')
	const inputRef = useRef<HTMLInputElement>(null)
	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

	useEffect(() => {
		if (!places || !inputRef.current) return

		const options: google.maps.places.AutocompleteOptions = {
			fields: ['geometry', 'name', 'formatted_address'],
			types: ['geocode', 'establishment'],
		}

		autocompleteRef.current = new places.Autocomplete(inputRef.current, options)

		const placeChangedListener = autocompleteRef.current.addListener(
			'place_changed',
			() => {
				if (autocompleteRef.current) {
					const place = autocompleteRef.current.getPlace()
					if (place && place.geometry && place.geometry.location) {
						console.log('Selected place:', {
							address: place.formatted_address,
							lat: place.geometry.location.lat(),
							lng: place.geometry.location.lng(),
						})
						onPlaceSelect(place)
					} else {
						console.error('Selected place has no geometry')
					}
				}
			}
		)

		if (map) {
			autocompleteRef.current.bindTo('bounds', map)
		}

		return () => {
			if (placeChangedListener) {
				placeChangedListener.remove()
			}
			if (autocompleteRef.current) {
				google.maps.event.clearInstanceListeners(autocompleteRef.current)
			}
		}
	}, [places, onPlaceSelect, map])

	return (
		<div className='w-full space-y-2'>
			{label && <FormLabel>{label}</FormLabel>}
			<div className='relative flex items-center gap-2'>
				<input
					ref={inputRef}
					id={inputId}
					className='w-full p-2 border rounded-md'
					placeholder={placeholder}
					type='text'
				/>
				{onRemove && (
					<Button
						type='button'
						variant='ghost'
						size='icon'
						onClick={onRemove}
						className='absolute right-2'
					>
						<X className='h-4 w-4' />
					</Button>
				)}
			</div>
		</div>
	)
}
