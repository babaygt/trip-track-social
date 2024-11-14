import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { authApi } from '@/services'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'

export function Navbar() {
	const { isAuthenticated, setUser } = useAuthStore()

	const handleLogout = async () => {
		try {
			await authApi.logout()
			setUser(null)
			toast.success('Logged out successfully')
		} catch {
			toast.error('Failed to logout')
		}
	}

	const NavItems = () => (
		<>
			{isAuthenticated ? (
				<>
					<Link to='/profile'>
						<Button variant='ghost'>Profile</Button>
					</Link>
					<Button onClick={handleLogout} variant='ghost'>
						Logout
					</Button>
				</>
			) : (
				<>
					<Link to='/login'>
						<Button variant='ghost'>Login</Button>
					</Link>
					<Link to='/register'>
						<Button variant='ghost'>Register</Button>
					</Link>
				</>
			)}
		</>
	)

	return (
		<nav className='border-b px-4 md:px-6'>
			<div className='container mx-auto flex h-16 items-center justify-between'>
				<Link to='/' className='text-xl font-bold'>
					Trip Track
				</Link>

				{/* Desktop Navigation */}
				<div className='hidden space-x-4 md:flex'>
					<NavItems />
				</div>

				{/* Mobile Navigation */}
				<Sheet>
					<SheetTrigger asChild className='md:hidden'>
						<Button variant='ghost' size='icon'>
							<Menu className='h-6 w-6' />
						</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Trip Track</SheetTitle>
						</SheetHeader>
						<div className='mt-4 flex flex-col space-y-4'>
							<NavItems />
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	)
}
