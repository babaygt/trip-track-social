import { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import type { Message } from '@/services/conversation'

interface MessageListProps {
	messages: Message[]
	isLoading: boolean
	error?: Error
	onMarkAsRead?: (messageId: string) => void
}

export function MessageList({
	messages,
	isLoading,
	error,
	onMarkAsRead,
}: MessageListProps) {
	const { user } = useAuthStore()
	const bottomRef = useRef<HTMLDivElement>(null)
	const processedMessages = useRef<Set<string>>(new Set())

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	useEffect(() => {
		if (!onMarkAsRead || !user?._id) return

		messages.forEach((message) => {
			if (
				message.sender._id !== user._id &&
				!message.readBy.some((reader) => reader._id === user._id) &&
				!processedMessages.current.has(message._id)
			) {
				processedMessages.current.add(message._id)
				onMarkAsRead(message._id)
			}
		})
	}, [messages, onMarkAsRead, user?._id])

	// Clear processed messages when conversation changes
	useEffect(() => {
		return () => {
			processedMessages.current.clear()
		}
	}, [messages[0]?._id]) // Use first message ID as conversation identifier

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
				<p className='text-sm text-muted-foreground'>Failed to load messages</p>
			</div>
		)
	}

	if (messages.length === 0) {
		return (
			<div className='flex h-full items-center justify-center'>
				<p className='text-sm text-muted-foreground'>No messages yet</p>
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-4 p-4'>
			{messages.map((message) => {
				const isSender = message.sender._id === user?._id

				return (
					<div
						key={message._id}
						className={`flex items-start gap-3 ${
							isSender ? 'flex-row-reverse' : ''
						}`}
					>
						<Avatar className='h-8 w-8'>
							{message.sender.profilePicture ? (
								<AvatarImage
									src={message.sender.profilePicture}
									alt={message.sender.name}
								/>
							) : (
								<AvatarFallback>
									{getInitials(message.sender.name)}
								</AvatarFallback>
							)}
						</Avatar>
						<div
							className={`flex max-w-[70%] flex-col gap-1 ${
								isSender ? 'items-end' : ''
							}`}
						>
							<div
								className={`rounded-lg p-3 ${
									isSender ? 'bg-primary text-primary-foreground' : 'bg-muted'
								}`}
							>
								<p className='whitespace-pre-wrap break-words'>
									{message.content}
								</p>
							</div>
							<div className='flex items-center gap-2 text-xs text-muted-foreground'>
								<span>
									{formatDistanceToNow(new Date(message.createdAt), {
										addSuffix: true,
									})}
								</span>
								{isSender && message.readBy.length > 1 && <span>• Read</span>}
							</div>
						</div>
					</div>
				)
			})}
			<div ref={bottomRef} />
		</div>
	)
}
