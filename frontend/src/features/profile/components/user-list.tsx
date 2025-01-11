import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import type { User } from '@/stores/auth-store'
import { Link } from 'react-router-dom'

interface UserListProps {
	users: User[]
	isLoading?: boolean
	emptyMessage?: string
}

export function UserList({
	users,
	isLoading = false,
	emptyMessage = 'No users found',
}: UserListProps) {
	if (isLoading) {
		return (
			<div className='flex items-center justify-center p-4'>
				<div className='h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent' />
			</div>
		)
	}

	if (users.length === 0) {
		return (
			<div className='flex items-center justify-center p-4 text-sm text-muted-foreground'>
				{emptyMessage}
			</div>
		)
	}

	return (
		<div className='divide-y'>
			{users.map((user) => (
				<Link
					key={user._id}
					to={`/profile/${user.username}`}
					className='flex items-center gap-3 p-4 hover:bg-muted/50'
				>
					<Avatar className='h-10 w-10'>
						{user.profilePicture ? (
							<AvatarImage src={user.profilePicture} alt={user.name} />
						) : (
							<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
						)}
					</Avatar>
					<div className='flex flex-col'>
						<span className='font-medium'>{user.name}</span>
						<span className='text-sm text-muted-foreground'>
							@{user.username}
						</span>
					</div>
				</Link>
			))}
		</div>
	)
}
