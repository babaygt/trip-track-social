import { RouteFeed } from '@/features/route/components/route-feed'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
	return (
		<div className='min-h-screen bg-background'>
			<div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
				<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8'>
					<div>
						<h1 className='text-3xl font-bold text-foreground'>
							Discover Routes
						</h1>
						<p className='mt-1 text-sm text-foreground'>
							Explore and share travel routes with the community
						</p>
					</div>
					<Link to='/create-route'>
						<Button className='w-full sm:w-auto flex items-center gap-2 px-6 bg-primary text-background hover:bg-primary/90'>
							<Plus className='h-4 w-4 text-background' />
							Create Route
						</Button>
					</Link>
				</div>

				<div className='max-w-6xl mx-auto'>
					<RouteFeed />
				</div>
			</div>
		</div>
	)
}
