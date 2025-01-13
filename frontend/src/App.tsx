import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { routes } from './routes'
import { RootLayout } from './components/layout/root-layout'
import { ThemeProvider } from '@/components/theme-provider'

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
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<Toaster position='top-right' toastOptions={{ duration: 4000 }} />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</ThemeProvider>
	)
}

export default App
