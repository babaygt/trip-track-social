import { api } from '@/lib/axios'
import type { User } from '@/stores/auth-store'

export interface Conversation {
	_id: string
	participants: User[]
	lastMessage?: Message
	updatedAt: string
	createdAt: string
}

export interface Message {
	_id: string
	conversation: string
	sender: User
	content: string
	readBy: User[]
	createdAt: string
	updatedAt: string
}

export const conversationApi = {
	createConversation: async (participantIds: string[]) => {
		const response = await api.post('conversations', { participantIds })
		return response.data as Conversation
	},

	getUserConversations: async (userId: string, page = 1, limit = 20) => {
		const response = await api.get(
			`conversations/user/${userId}?page=${page}&limit=${limit}`
		)
		return response.data as {
			data: Conversation[]
			total: number
			pages: number
		}
	},
}
