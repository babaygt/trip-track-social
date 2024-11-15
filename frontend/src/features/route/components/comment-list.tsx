import { Comment } from './comment'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRouteComments } from '../hooks/use-route-comments'
import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { RouteResponse } from '@/services/route'

interface CommentListProps {
	route: RouteResponse
	onCommentUpdate: () => void
}

export function CommentList({ route, onCommentUpdate }: CommentListProps) {
	const { user } = useAuthStore()
	const { comments, addComment, removeComment } = useRouteComments(
		route,
		onCommentUpdate
	)
	const [newComment, setNewComment] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const trimmedComment = String(newComment).trim()
		if (!trimmedComment) return

		await addComment(trimmedComment)
		setNewComment('')
	}

	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-semibold'>Comments ({comments.length})</h3>

			{user && (
				<form onSubmit={handleSubmit} className='space-y-4'>
					<Textarea
						placeholder='Add a comment...'
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
					/>
					<Button type='submit' disabled={!String(newComment).trim()}>
						Post Comment
					</Button>
				</form>
			)}

			<div className='space-y-4 divide-y max-h-[400px] overflow-y-auto pr-4'>
				{comments.map((comment) => (
					<Comment
						key={comment._id}
						comment={comment}
						onDelete={removeComment}
					/>
				))}
			</div>
		</div>
	)
}
