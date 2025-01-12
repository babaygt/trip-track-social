import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { messageApi } from '@/services/message'
import type { Message } from '@/services/conversation'
import { useAuthStore } from '@/stores/auth-store'
import toast from 'react-hot-toast'

interface MessagePage {
	data: Message[]
	total: number
	pages: number
}

export function useMessages(conversationId: string) {
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
		queryKey: ['messages', conversationId],
		queryFn: ({ pageParam = 1 }) =>
			messageApi.getConversationMessages(conversationId, pageParam),
		getNextPageParam: (lastPage: MessagePage) => {
			if (lastPage.pages > lastPage.data.length) {
				return lastPage.data.length + 1
			}
			return undefined
		},
		enabled: !!conversationId,
		initialPageParam: 1,
	})

	const { mutate: sendMessage, isPending: isSending } = useMutation({
		mutationFn: (content: string) =>
			messageApi.sendMessage(conversationId, user!._id, content),
		onSuccess: (newMessage) => {
			queryClient.setQueryData(
				['messages', conversationId],
				(oldData: { pages: MessagePage[] } | undefined) => {
					if (!oldData?.pages) return oldData
					return {
						...oldData,
						pages: oldData.pages.map((page, index) => {
							if (index === 0) {
								return {
									...page,
									data: [newMessage, ...page.data],
								}
							}
							return page
						}),
					}
				}
			)
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to send message')
		},
	})

	const { mutate: markAsRead } = useMutation({
		mutationFn: (messageId: string) =>
			messageApi.markAsRead(messageId, user!._id),
		onSuccess: (updatedMessage) => {
			queryClient.setQueryData(
				['messages', conversationId],
				(oldData: { pages: MessagePage[] } | undefined) => {
					if (!oldData?.pages) return oldData
					return {
						...oldData,
						pages: oldData.pages.map((page) => ({
							...page,
							data: page.data.map((message) =>
								message._id === updatedMessage._id ? updatedMessage : message
							),
						})),
					}
				}
			)
		},
	})

	return {
		messages: data?.pages.flatMap((page) => page.data).reverse() ?? [],
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
		sendMessage,
		isSending,
		markAsRead,
	}
}
