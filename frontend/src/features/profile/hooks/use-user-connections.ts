import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/services/user'
import type { User } from '@/stores/auth-store'

export function useUserConnections(user: User) {
	const {
		data: followers,
		isLoading: isLoadingFollowers,
		error: followersError,
	} = useQuery({
		queryKey: ['followers', user._id],
		queryFn: () => userApi.getFollowers(user._id),
		enabled: !!user._id,
	})

	const {
		data: following,
		isLoading: isLoadingFollowing,
		error: followingError,
	} = useQuery({
		queryKey: ['following', user._id],
		queryFn: () => userApi.getFollowing(user._id),
		enabled: !!user._id,
	})

	return {
		followers: followers || [],
		following: following || [],
		isLoadingFollowers,
		isLoadingFollowing,
		followersError,
		followingError,
	}
}
