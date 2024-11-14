import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { userApi } from '@/services'

export function useProfile() {
	const { username } = useParams()
	const { user: currentUser } = useAuthStore()

	const { data: profileUser, isLoading } = useQuery({
		queryKey: ['profile', username],
		queryFn: () => userApi.getUserByUsername(username!),
		enabled: !!username && username !== currentUser?.username,
	})

	const user = username ? profileUser : currentUser
	const isOwnProfile = !username || username === currentUser?.username

	return {
		user,
		isLoading,
		isOwnProfile,
	}
}
