import { useState } from 'react'
import { ConversationList } from './conversation-list'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'
import { useMessages } from '../hooks/use-messages'
import type { Conversation } from '@/services/conversation'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export function ChatInterface() {
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation>()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const { messages, isLoading, error, sendMessage, isSending, markAsRead } =
		useMessages(selectedConversation?._id ?? '')

	return (
		<div className='flex h-[calc(100vh-65px)]'>
			{/* Mobile menu button */}
			<Button
				variant='ghost'
				size='icon'
				className='absolute left-4 top-4 md:hidden'
				onClick={() => setIsMobileMenuOpen(true)}
			>
				<Menu className='h-6 w-6' />
			</Button>

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
