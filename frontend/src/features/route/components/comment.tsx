import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { formatDistanceToNow } from 'date-fns'

interface CommentProps {
	comment: {
		_id: string
		content: string
		user: {
			_id: string
			name: string
			username: string
			profilePicture?: string
		}
		createdAt: string
	}
	onDelete: (commentId: string) => void
}

export function Comment({ comment, onDelete }: CommentProps) {
	const { user } = useAuthStore()
	const isOwner = user?._id === comment.user._id

	return (
		<div className='flex gap-4 py-4'>
			<Avatar className='h-8 w-8'>
				<AvatarImage src={comment.user.profilePicture} />
				<AvatarFallback>{comment.user.name[0]}</AvatarFallback>
			</Avatar>
			<div className='flex-1'>
				<div className='flex items-center justify-between'>
					<div>
						<span className='font-semibold'>{comment.user.name}</span>
						<span className='text-sm text-muted-foreground ml-2'>
							@{comment.user.username}
						</span>
						<span className='text-sm text-muted-foreground ml-2'>
							{formatDistanceToNow(new Date(comment.createdAt), {
								addSuffix: true,
							})}
						</span>
					</div>
					{isOwner && (
						<Button
							variant='ghost'
							size='sm'
							onClick={() => onDelete(comment._id)}
							className='text-destructive hover:text-destructive'
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					)}
				</div>
				<p className='mt-1 text-sm'>{comment.content}</p>
			</div>
		</div>
	)
}
