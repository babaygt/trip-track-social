import { Link } from 'react-router-dom'
import { LogOut, Menu, MessageSquare, User } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { authApi } from '@/services'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { useNavigate } from 'react-router-dom'

export function Navbar() {
	const navigate = useNavigate()
	const { isAuthenticated, user, setUser } = useAuthStore()

	const handleLogout = async () => {
		try {
			await authApi.logout()
			setUser(null)
			toast.success('Logged out successfully')
			navigate('/login')
		} catch {
			toast.error('Failed to logout')
		}
	}

	const UserMenu = () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='flex items-center gap-2'>
					<Avatar className='h-8 w-8'>
						<AvatarImage src={user?.profilePicture} />
						<AvatarFallback>
							{user?.name?.[0] || <User className='h-4 w-4' />}
						</AvatarFallback>
					</Avatar>
					<span className='hidden md:inline'>{user?.name}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-56'>
				<DropdownMenuLabel>
					<div className='flex flex-col'>
						<span>{user?.name}</span>
						<span className='text-sm text-muted-foreground'>
							@{user?.username}
						</span>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<Link to='/profile'>
					<DropdownMenuItem>Profile</DropdownMenuItem>
				</Link>
				<DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)

	const NavItems = () => (
		<>
			{isAuthenticated ? (
				<>
					<Link to='/chat'>
						<Button variant='ghost' className='flex items-center gap-2'>
							<MessageSquare className='h-5 w-5' />
							<span className='hidden md:inline'>Messages</span>
						</Button>
					</Link>
					<ModeToggle />
					<UserMenu />
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
				<div className='hidden space-x-2 md:flex items-center'>
					<NavItems />
				</div>

				{/* Mobile Navigation */}
				<Sheet>
					<div className='flex items-center gap-2 md:hidden'>
						<div className='flex items-center gap-2'>
							<ModeToggle />
						</div>
						<SheetTrigger asChild className='md:hidden'>
							<Button variant='ghost' size='icon'>
								<Menu className='h-6 w-6' />
							</Button>
						</SheetTrigger>
					</div>
					<SheetContent>
						<SheetHeader className='border-b pb-4 mb-4'>
							<SheetTitle>Menu</SheetTitle>
						</SheetHeader>
						<div className='flex flex-col space-y-3'>
							{isAuthenticated ? (
								<>
									<div className='flex items-center gap-3 p-2 mb-2 bg-secondary rounded-lg'>
										<Avatar className='h-10 w-10'>
											<AvatarImage src={user?.profilePicture} />
											<AvatarFallback>
												{user?.name?.[0] || <User className='h-4 w-4' />}
											</AvatarFallback>
										</Avatar>
										<div className='flex flex-col text-secondary-foreground'>
											<span className='font-medium'>{user?.name}</span>
											<span className='text-sm text-muted-foreground'>
												@{user?.username}
											</span>
										</div>
									</div>
									<Link to='/profile' className='w-full'>
										<Button
											variant='secondary'
											className='w-full justify-start gap-2'
										>
											<User className='h-5 w-5' />
											Profile
										</Button>
									</Link>
									<Link to='/chat' className='w-full'>
										<Button
											variant='secondary'
											className='w-full justify-start gap-2'
										>
											<MessageSquare className='h-5 w-5' />
											Messages
										</Button>
									</Link>

									<Button
										variant='destructive'
										className='w-full justify-start gap-2'
										onClick={handleLogout}
									>
										<LogOut className='h-5 w-5' />
										Logout
									</Button>
								</>
							) : (
								<>
									<Link to='/login' className='w-full'>
										<Button variant='default' className='w-full'>
											Login
										</Button>
									</Link>
									<Link to='/register' className='w-full'>
										<Button variant='outline' className='w-full'>
											Register
										</Button>
									</Link>
								</>
							)}
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	)
}
