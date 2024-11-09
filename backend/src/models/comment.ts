import { Schema, Types } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

export interface IComment {
	user: Types.ObjectId
	content: string
	createdAt: Date
}

export const CommentSchema = new Schema<IComment>({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'User is required'],
		autopopulate: {
			select: 'username profilePicture name',
		},
	},
	content: {
		type: String,
		required: [true, 'Comment content is required'],
		trim: true,
		maxlength: [500, 'Comment cannot exceed 500 characters'],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

// Add any comment-specific methods here if needed
CommentSchema.methods.isOwner = function (userId: string): boolean {
	return this.user.toString() === userId.toString()
}

// Plugin
CommentSchema.plugin(autopopulate)
