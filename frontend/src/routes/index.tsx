/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const Register = lazy(() => import('@/features/auth/register'))
const Login = lazy(() => import('@/features/auth/login/'))
const Profile = lazy(() => import('@/features/profile/page'))
const RouteCreator = lazy(() => import('@/features/route/index'))
const Home = lazy(() => import('@/features/home/page'))
const RoutePost = lazy(() => import('@/features/route/pages/route-post-page'))

export const routes: RouteObject[] = [
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/register',
		element: <Register />,
	},
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/profile',
		element: <Profile />,
	},
	{
		path: '/profile/:username',
		element: <Profile />,
	},
	{
		path: '/create-route',
		element: <RouteCreator />,
	},
	{
		path: '/routes/:routeId',
		element: <RoutePost />,
	},
]
