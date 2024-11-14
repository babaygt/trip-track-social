import type { User } from '@/stores/auth-store'

interface ProfileStatsProps {
	user: User
}

export function ProfileStats({ user }: ProfileStatsProps) {
	return (
		<div className='px-4 py-3'>
			<div className='flex gap-4 text-sm'>
				<div className='flex gap-1'>
					<span className='font-bold'>{user.following?.length || 0}</span>
					<span className='text-muted-foreground'>Following</span>
				</div>
				<div className='flex gap-1'>
					<span className='font-bold'>{user.followers?.length || 0}</span>
					<span className='text-muted-foreground'>Followers</span>
				</div>
			</div>
		</div>
	)
}
