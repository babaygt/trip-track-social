import { useProfile } from './hooks/use-profile'
import { Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { ProfileHeader } from './components/profile-header'
import { ProfileInfo } from './components/profile-info'
import { ProfileStats } from './components/profile-stats'
import { ProfileContent } from './components/profile-content'
import { Navigate } from 'react-router-dom'

export default function ProfilePage() {
	const { user, isLoading, isOwnProfile } = useProfile()

	if (isLoading) {
		return (
			<div className='flex h-[calc(100vh-4rem)] items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin text-primary' />
			</div>
		)
	}

	if (!user) {
		if (isOwnProfile) {
			return <Navigate to='/profile' replace />
		}

		return (
			<div className='flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4'>
				<h2 className='text-2xl font-semibold text-muted-foreground'>
					User Not Found
				</h2>
				<p className='text-sm text-muted-foreground'>
					There is no user with this username
				</p>
			</div>
		)
	}

	return (
		<div className='flex flex-col items-center gap-8 p-4'>
			<Card className='w-full max-w-xl bg-background'>
				<ProfileHeader user={user} isOwnProfile={isOwnProfile} />
				<ProfileInfo user={user} />
				<ProfileStats user={user} />
			</Card>

			<ProfileContent user={user} />
		</div>
	)
}
