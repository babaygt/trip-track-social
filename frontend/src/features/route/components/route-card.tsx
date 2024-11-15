import { APIProvider } from '@vis.gl/react-google-maps'
import { RouteResponse } from '@/services/route'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TRAVEL_MODES } from '../types'
import { MapPin, Heart, MessageSquare, Clock, Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RoutePreviewMap } from '@/components/maps/route-preview-map'
import { useRouteLike } from '../hooks/use-route-like'
import { useRouteStats } from '../hooks/use-route-stats'
import { useRouteBookmark } from '../hooks/use-route-bookmark'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

interface RouteCardProps {
	route: RouteResponse
}

export function RouteCard({ route }: RouteCardProps) {
	const { isLiked, likeCount, handleLike } = useRouteLike(route)
	const { isBookmarked, handleBookmark } = useRouteBookmark(route)
	const { commentCount } = useRouteStats(route)

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
				<CardContent className='space-y-3'>
					<div className='flex items-center gap-4 text-sm text-muted-foreground'>
						<div className='flex items-center gap-1'>
							<MapPin className='h-4 w-4 shrink-0' />
							<span>
								{route.totalDistance >= 1000
									? `${(route.totalDistance / 1000).toFixed(1)}km`
									: `${Math.round(route.totalDistance)}m`}
							</span>
						</div>

						<div className='flex items-center gap-1'>
							<Clock className='h-4 w-4 shrink-0' />
							<span>
								{route.totalTime / 60 >= 60
									? `${Math.floor(route.totalTime / 3600)}h ${Math.round(
											(route.totalTime % 3600) / 60
									  )}m`
									: `${Math.round(route.totalTime / 60)}m`}
							</span>
						</div>

						<div className='flex items-center gap-1'>
							<span>{travelMode?.label}</span>
						</div>
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
			<CardContent className='pt-0'>
				<div className='flex items-center gap-2 text-sm text-muted-foreground'>
					<button
						onClick={(e) => {
							e.stopPropagation()
							handleLike()
						}}
						className='flex items-center gap-1 hover:text-primary transition-colors'
					>
						<Heart
							className={`h-4 w-4 ${
								isLiked ? 'fill-current text-red-500' : ''
							}`}
						/>
						<span>{likeCount}</span>
					</button>

					<button
						onClick={(e) => {
							e.stopPropagation()
							handleBookmark()
						}}
						className='flex items-center gap-1 hover:text-primary transition-colors'
					>
						<Bookmark
							className={`h-4 w-4 ${
								isBookmarked ? 'fill-current text-primary' : ''
							}`}
						/>
					</button>

					<Link
						to={`/routes/${route._id}`}
						className='flex items-center gap-1 hover:text-primary transition-colors'
					>
						<MessageSquare className='h-4 w-4' />
						<span>{commentCount}</span>
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
