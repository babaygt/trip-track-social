import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

export function RootLayout() {
	return (
		<div className='min-h-screen bg-background'>
			<Suspense
				fallback={
					<div className='flex h-screen items-center justify-center'>
						<Loader2 className='h-8 w-8 animate-spin text-primary' />
					</div>
				}
			>
				<Outlet />
			</Suspense>
		</div>
	)
}
