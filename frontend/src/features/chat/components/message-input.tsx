import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'

interface MessageInputProps {
	onSend: (content: string) => void
	isLoading?: boolean
}

export function MessageInput({ onSend, isLoading }: MessageInputProps) {
	const [content, setContent] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!content.trim()) return

		onSend(content.trim())
		setContent('')
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit(e)
		}
	}

	return (
		<form onSubmit={handleSubmit} className='flex gap-2 p-4'>
			<Textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder='Type a message...'
				className='min-h-[44px] max-h-[120px] resize-none'
				disabled={isLoading}
			/>
			<Button type='submit' size='icon' disabled={!content.trim() || isLoading}>
				<Send className='h-4 w-4' />
			</Button>
		</form>
	)
}
