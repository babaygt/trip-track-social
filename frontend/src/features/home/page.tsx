import { RouteFeed } from '@/features/route/components/route-feed'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center mb-8'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>
							Discover Routes
						</h1>
						<p className='mt-1 text-sm text-gray-500'>
							Explore and share travel routes with the community
						</p>
					</div>
					<Link to='/create-route'>
						<Button className='flex items-center gap-2 px-6'>
							<Plus className='h-4 w-4' />
							Create Route
						</Button>
					</Link>
				</div>

				<RouteFeed />
			</div>
		</div>
	)
}
