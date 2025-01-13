import {
	useRouteError,
	isRouteErrorResponse,
	useNavigate,
} from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

interface ErrorPageProps {
	error?: Error | null
}

export function ErrorPage({ error }: ErrorPageProps) {
	const navigate = useNavigate()
	const routeError = useRouteError()

	let errorMessage = 'An unexpected error occurred'
	let statusCode = 500

	if (error) {
		errorMessage = error.message
	} else if (isRouteErrorResponse(routeError)) {
		statusCode = routeError.status
		errorMessage = routeError.statusText || 'Page not found'
	} else if (routeError instanceof Error) {
		errorMessage = routeError.message
	}

	const is404 = statusCode === 404

	return (
		<div className='min-h-screen flex items-center justify-center p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<AlertCircle className='h-5 w-5 text-destructive' />
						{is404 ? 'Page Not Found' : 'Error'}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-muted-foreground'>
						{is404
							? "The page you're looking for doesn't exist."
							: errorMessage}
					</p>
				</CardContent>
				<CardFooter className='flex gap-2'>
					<Button onClick={() => navigate(-1)}>Go Back</Button>
					<Button variant='outline' onClick={() => navigate('/')}>
						Go Home
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
