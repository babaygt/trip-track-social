import { APIProvider } from '@vis.gl/react-google-maps'
import { RouteResponse } from '@/services/route'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TRAVEL_MODES } from '../types'
import { MapPin, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RoutePreviewMap } from '@/components/maps/route-preview-map'
import { useRouteLike } from '../hooks/use-route-like'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

interface RouteCardProps {
	route: RouteResponse
}

export function RouteCard({ route }: RouteCardProps) {
	const { isLiked, likeCount, handleLike } = useRouteLike(route)

	const travelMode = TRAVEL_MODES.find(
		(mode) => mode.value === route.travelMode
	)

	if (!GOOGLE_MAPS_API_KEY) {
		return null
	}

	return (
		<Card className='overflow-hidden hover:shadow-lg transition-all duration-300 group'>
			<Link to={`/routes/${route._id}`}>
				<div className='relative h-[200px] w-full overflow-hidden'>
					<APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
						<RoutePreviewMap route={route} />
					</APIProvider>
					<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
				</div>
				<CardHeader className='flex flex-row items-center gap-4 pt-4'>
					<Avatar className='h-10 w-10'>
						<AvatarImage src={route.creator.profilePicture} />
						<AvatarFallback>{route.creator.name[0]}</AvatarFallback>
					</Avatar>
					<div className='flex-1'>
						<h3 className='font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors'>
							{route.title}
						</h3>
						<p className='text-sm text-muted-foreground'>
							by {route.creator.name}
						</p>
					</div>
				</CardHeader>
				<CardContent className='space-y-3 pb-4'>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<MapPin className='h-4 w-4 shrink-0' />
						<span>{(route.totalDistance / 1000).toFixed(1)} km</span>
						<span>•</span>
						<span>{Math.round(route.totalTime / 60)} mins</span>
						<span>•</span>
						<span>{travelMode?.label}</span>
					</div>
					{route.description && (
						<p className='text-sm text-muted-foreground line-clamp-2'>
							{route.description}
						</p>
					)}
					{route.tags.length > 0 && (
						<div className='flex flex-wrap gap-1.5'>
							{route.tags.map((tag) => (
								<span
									key={tag}
									className='px-2.5 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full'
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</CardContent>
			</Link>
			<div className='flex items-center justify-between p-4'>
				<button
					onClick={handleLike}
					className={`flex items-center gap-1 text-sm ${
						isLiked ? 'text-red-500 bg' : 'text-gray-500'
					} hover:text-red-600 transition-colors`}
				>
					<Heart className='h-5 w-5' />
					{likeCount}
				</button>
			</div>
		</Card>
	)
}
