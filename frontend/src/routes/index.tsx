import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

// eslint-disable-next-line react-refresh/only-export-components
const Register = lazy(() => import('@/features/auth/register'))

export const routes: RouteObject[] = [
	{
		path: '/register',
		element: <Register />,
	},
]
