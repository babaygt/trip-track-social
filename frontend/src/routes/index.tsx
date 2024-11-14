/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const Register = lazy(() => import('@/features/auth/register'))
const Login = lazy(() => import('@/features/auth/login/'))

export const routes: RouteObject[] = [
	{
		path: '/register',
		element: <Register />,
	},
	{
		path: '/login',
		element: <Login />,
	},
]
