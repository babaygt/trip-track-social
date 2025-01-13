import type { User } from '@/stores/auth-store'
import { ConnectionsDialog } from './connections-dialog'

interface ProfileStatsProps {
	user: User
}

export function ProfileStats({ user }: ProfileStatsProps) {
	return (
		<div className='px-4 py-3'>
			<div className='flex justify-center sm:justify-start gap-4 text-sm'>
				<ConnectionsDialog
					user={user}
					defaultTab='following'
					trigger={
						<button className='flex gap-1 hover:text-primary'>
							<span className='font-bold'>{user.following?.length || 0}</span>
							<span className='text-muted-foreground'>Following</span>
						</button>
					}
				/>
				<ConnectionsDialog
					user={user}
					defaultTab='followers'
					trigger={
						<button className='flex gap-1 hover:text-primary'>
							<span className='font-bold'>{user.followers?.length || 0}</span>
							<span className='text-muted-foreground'>Followers</span>
						</button>
					}
				/>
			</div>
		</div>
	)
}
