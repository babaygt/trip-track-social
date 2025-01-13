import { Calendar } from 'lucide-react'
import { format } from 'date-fns'
import type { User } from '@/stores/auth-store'

interface ProfileInfoProps {
	user: User
}

export function ProfileInfo({ user }: ProfileInfoProps) {
	return (
		<div className='px-4 space-y-2'>
			{user.bio && (
				<p className='text-sm text-center sm:text-left'>{user.bio}</p>
			)}
			<div className='flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground'>
				<Calendar className='h-4 w-4' />
				<span>
					{user.createdAt
						? `Joined ${format(new Date(user.createdAt), 'MMMM yyyy')}`
						: 'Unknown join date'}
				</span>
			</div>
		</div>
	)
}
