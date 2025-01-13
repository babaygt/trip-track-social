import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'
import { useAuthStore, User } from '@/stores/auth-store'
import { useUserFollow } from '../hooks/use-user-follow'
import { Link, useNavigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { useConversations } from '@/features/chat/hooks/use-conversations'

interface ProfileHeaderProps {
	user: User
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
	const { user: currentUser } = useAuthStore()
	const { isFollowing, handleFollow } = useUserFollow(user)
	const { createConversation } = useConversations()
	const navigate = useNavigate()

	const isOwnProfile = currentUser?._id === user._id

	const handleMessage = async () => {
		if (!currentUser) return
		const conversation = await createConversation([currentUser._id, user._id])
		navigate('/chat', { state: { selectedConversation: conversation } })
	}

	return (
		<div className='flex flex-col gap-4 p-4'>
			<div className='flex flex-col items-center justify-center sm:flex-row sm:items-center gap-4'>
				<Avatar className='h-20 w-20'>
					{user.profilePicture ? (
						<AvatarImage src={user.profilePicture} alt={user.name} />
					) : (
						<AvatarFallback className='text-lg'>
							{getInitials(user.name)}
						</AvatarFallback>
					)}
				</Avatar>
				<div className='flex-1 text-center sm:text-left'>
					<h1 className='text-2xl font-bold'>{user.name}</h1>
					<p className='text-sm text-muted-foreground'>@{user.username}</p>
				</div>
				<div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
					{isOwnProfile ? (
						<Button
							variant='outline'
							size='sm'
							className='w-full sm:w-auto'
							asChild
						>
							<Link to='/profile/edit'>Edit profile</Link>
						</Button>
					) : (
						currentUser && (
							<>
								<Button
									variant={isFollowing ? 'outline' : 'default'}
									size='sm'
									onClick={handleFollow}
									className='w-full sm:w-auto'
								>
									{isFollowing ? 'Unfollow' : 'Follow'}
								</Button>
								<Button
									variant='secondary'
									size='sm'
									onClick={handleMessage}
									className='w-full sm:w-auto gap-2'
								>
									<MessageSquare className='h-4 w-4' />
									<span>Message</span>
								</Button>
							</>
						)
					)}
				</div>
			</div>
		</div>
	)
}
