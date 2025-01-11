import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { User } from '@/stores/auth-store'
import { useUserConnections } from '../hooks/use-user-connections'
import { UserList } from './user-list'

interface ConnectionsDialogProps {
	user: User
	trigger: React.ReactNode
	defaultTab?: 'followers' | 'following'
}

export function ConnectionsDialog({
	user,
	trigger,
	defaultTab = 'followers',
}: ConnectionsDialogProps) {
	const { followers, following, isLoadingFollowers, isLoadingFollowing } =
		useUserConnections(user)

	return (
		<Sheet>
			<SheetTrigger asChild>{trigger}</SheetTrigger>
			<SheetContent className='w-full sm:max-w-md'>
				<SheetHeader>
					<SheetTitle>Connections</SheetTitle>
				</SheetHeader>
				<Tabs defaultValue={defaultTab} className='mt-6'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='followers'>
							Followers ({user.followers?.length || 0})
						</TabsTrigger>
						<TabsTrigger value='following'>
							Following ({user.following?.length || 0})
						</TabsTrigger>
					</TabsList>
					<TabsContent value='followers'>
						<UserList
							users={followers}
							isLoading={isLoadingFollowers}
							emptyMessage='No followers yet'
						/>
					</TabsContent>
					<TabsContent value='following'>
						<UserList
							users={following}
							isLoading={isLoadingFollowing}
							emptyMessage='Not following anyone'
						/>
					</TabsContent>
				</Tabs>
			</SheetContent>
		</Sheet>
	)
}
