import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Navbar } from './navbar'

export function RootLayout() {
	return (
		<div className='min-h-screen bg-background'>
			<Navbar />
			<Suspense
				fallback={
					<div className='flex h-[calc(100vh-4rem)] items-center justify-center'>
						<Loader2 className='h-8 w-8 animate-spin text-primary' />
					</div>
				}
			>
				<Outlet />
			</Suspense>
		</div>
	)
}
