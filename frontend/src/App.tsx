import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { routes } from './routes'
import { RootLayout } from './components/layout/root-layout'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			retry: 1,
		},
	},
})

const router = createBrowserRouter([
	{
		element: <RootLayout />,
		children: routes,
	},
])

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<Toaster position='top-right' toastOptions={{ duration: 4000 }} />
		</QueryClientProvider>
	)
}

export default App
