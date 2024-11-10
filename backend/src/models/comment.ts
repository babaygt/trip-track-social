import { Schema, Types, Document } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

export interface IComment extends Document {
	user: Types.ObjectId
	content: string
	createdAt: Date
	isOwner: (userId: string) => boolean
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

// Methods
CommentSchema.methods.isOwner = function (userId: string): boolean {
	return this.user._id.toString() === userId.toString()
}

// Plugin
CommentSchema.plugin(autopopulate)
