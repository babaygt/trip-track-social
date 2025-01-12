import { useConversations } from '../hooks/use-conversations'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import type { Conversation } from '@/services/conversation'

interface ConversationListProps {
	onSelect: (conversation: Conversation) => void
	selectedId?: string
}

export function ConversationList({
	onSelect,
	selectedId,
}: ConversationListProps) {
	const { conversations, isLoading, error } = useConversations()
	const { user } = useAuthStore()

	if (isLoading) {
		return (
			<div className='flex h-full items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin text-primary' />
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex h-full items-center justify-center'>
				<p className='text-sm text-muted-foreground'>
					Failed to load conversations
				</p>
			</div>
		)
	}

	if (conversations.length === 0) {
		return (
			<div className='flex h-full items-center justify-center'>
				<p className='text-sm text-muted-foreground'>No conversations yet</p>
			</div>
		)
	}

	return (
		<div className='divide-y'>
			{conversations.map((conversation) => {
				const otherParticipant = conversation.participants.find(
					(p) => p._id !== user?._id
				)!

				return (
					<button
						key={conversation._id}
						className={`flex w-full items-center gap-3 p-4 hover:bg-muted/50 ${
							selectedId === conversation._id ? 'bg-muted' : ''
						}`}
						onClick={() => onSelect(conversation)}
					>
						<Avatar>
							{otherParticipant.profilePicture ? (
								<AvatarImage
									src={otherParticipant.profilePicture}
									alt={otherParticipant.name}
								/>
							) : (
								<AvatarFallback>
									{getInitials(otherParticipant.name)}
								</AvatarFallback>
							)}
						</Avatar>
						<div className='flex flex-1 flex-col items-start gap-1'>
							<span className='font-medium'>{otherParticipant.name}</span>
							{conversation.lastMessage && (
								<span className='text-sm text-muted-foreground line-clamp-1'>
									{conversation.lastMessage.content}
								</span>
							)}
						</div>
						{conversation.lastMessage && (
							<span className='text-xs text-muted-foreground'>
								{formatDistanceToNow(
									new Date(conversation.lastMessage.createdAt),
									{ addSuffix: true }
								)}
							</span>
						)}
					</button>
				)
			})}
		</div>
	)
}
