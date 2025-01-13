import { useState } from 'react'
import { ConversationList } from './conversation-list'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'
import { useMessages } from '../hooks/use-messages'
import type { Conversation } from '@/services/conversation'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Menu } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

export function ChatInterface() {
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation>()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const { messages, isLoading, error, sendMessage, isSending, markAsRead } =
		useMessages(selectedConversation?._id ?? '')

	return (
		<div className='flex h-[calc(100vh-65px)]'>
			{/* Conversation list - mobile */}
			<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
				<SheetContent side='left' className='w-[300px] p-0'>
					<div className='h-full overflow-y-auto border-r'>
						<ConversationList
							selectedId={selectedConversation?._id}
							onSelect={(conversation) => {
								setSelectedConversation(conversation)
								setIsMobileMenuOpen(false)
							}}
						/>
					</div>
				</SheetContent>
			</Sheet>

			{/* Conversation list - desktop */}
			<div className='hidden w-[300px] overflow-y-auto border-r md:block'>
				<ConversationList
					selectedId={selectedConversation?._id}
					onSelect={setSelectedConversation}
				/>
			</div>

			{/* Chat area */}
			<div className='flex flex-1 flex-col'>
				{/* Mobile header */}
				<div className='flex items-center gap-2 border-b p-4 md:hidden'>
					{selectedConversation ? (
						<>
							<Button
								variant='ghost'
								size='icon'
								className='shrink-0'
								onClick={() => setSelectedConversation(undefined)}
							>
								<ChevronLeft className='h-5 w-5' />
							</Button>
							<div className='flex items-center gap-2'>
								<Avatar className='h-8 w-8'>
									<AvatarImage
										src={selectedConversation.participants[0]?.profilePicture}
									/>
									<AvatarFallback>
										{getInitials(
											selectedConversation.participants[0]?.name || ''
										)}
									</AvatarFallback>
								</Avatar>
								<span className='font-medium'>
									{selectedConversation.participants[0]?.name}
								</span>
							</div>
						</>
					) : (
						<>
							<button
								onClick={() => setIsMobileMenuOpen(true)}
								className='flex items-center gap-2 -ml-2 p-2 hover:bg-accent rounded-md'
							>
								<Menu className='h-5 w-5' />
								<span className='font-medium'>Messages</span>
							</button>
						</>
					)}
				</div>

				{selectedConversation ? (
					<>
						<div className='flex-1 overflow-y-auto'>
							<MessageList
								messages={messages}
								isLoading={isLoading}
								error={error as Error}
								onMarkAsRead={markAsRead}
							/>
						</div>
						<MessageInput onSend={sendMessage} isLoading={isSending} />
					</>
				) : (
					<div className='flex h-full items-center justify-center'>
						<p className='text-sm text-muted-foreground'>
							Select a conversation to start chatting
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
