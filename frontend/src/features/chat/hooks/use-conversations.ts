import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { conversationApi, type Conversation } from '@/services/conversation'
import { useAuthStore } from '@/stores/auth-store'
import toast from 'react-hot-toast'

interface ConversationPage {
	data: Conversation[]
	total: number
	pages: number
}

export function useConversations() {
	const { user } = useAuthStore()
	const queryClient = useQueryClient()

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
	} = useInfiniteQuery({
		queryKey: ['conversations', user?._id],
		queryFn: ({ pageParam = 1 }) =>
			conversationApi.getUserConversations(user!._id, pageParam),
		getNextPageParam: (lastPage: ConversationPage) => {
			if (lastPage.pages > lastPage.data.length) {
				return lastPage.data.length + 1
			}
			return undefined
		},
		enabled: !!user?._id,
		initialPageParam: 1,
	})

	const { mutate: createConversation, isPending: isCreating } = useMutation({
		mutationFn: (participantIds: string[]) =>
			conversationApi.createConversation(participantIds),
		onSuccess: (newConversation) => {
			queryClient.setQueryData(
				['conversations', user?._id],
				(oldData: { pages: ConversationPage[] } | undefined) => {
					if (!oldData?.pages) return oldData
					return {
						...oldData,
						pages: oldData.pages.map((page, index) => {
							if (index === 0) {
								return {
									...page,
									data: [newConversation, ...page.data],
								}
							}
							return page
						}),
					}
				}
			)
			toast.success('Conversation created')
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to create conversation')
		},
	})

	return {
		conversations: data?.pages.flatMap((page) => page.data) ?? [],
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
		createConversation,
		isCreating,
	}
}
