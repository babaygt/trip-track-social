import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'
import type { User } from '@/stores/auth-store'

interface ProfileHeaderProps {
	user: User
	isOwnProfile: boolean
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
	return (
		<div className='p-4'>
			<div className='flex justify-between items-start mb-4'>
				<Avatar className='h-20 w-20'>
					{user.profilePicture ? (
						<AvatarImage src={user.profilePicture} alt={user.name} />
					) : (
						<AvatarFallback className='text-lg'>
							{getInitials(user.name)}
						</AvatarFallback>
					)}
				</Avatar>
				{isOwnProfile ? (
					<Button variant='outline' size='sm'>
						Edit profile
					</Button>
				) : (
					<Button variant='outline' size='sm'>
						Follow
					</Button>
				)}
			</div>
			<div className='space-y-1'>
				<h1 className='text-xl font-bold'>{user.name}</h1>
				<p className='text-sm text-muted-foreground'>@{user.username}</p>
			</div>
		</div>
	)
}
