import { api } from '@/lib/axios'
import type { Message } from './conversation'

export const messageApi = {
	sendMessage: async (
		conversationId: string,
		senderId: string,
		content: string
	) => {
		const response = await api.post('messages', {
			conversationId,
			senderId,
			content,
		})
		return response.data as Message
	},

	markAsRead: async (messageId: string, userId: string) => {
		const response = await api.put(`messages/${messageId}/read/${userId}`)
		return response.data as Message
	},

	getConversationMessages: async (
		conversationId: string,
		page = 1,
		limit = 50
	) => {
		const response = await api.get(
			`messages/conversation/${conversationId}?page=${page}&limit=${limit}`
		)
		return response.data as {
			data: Message[]
			total: number
			pages: number
		}
	},
}
