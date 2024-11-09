import { Schema, model, Document, Types } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

export interface IMessage extends Document {
	conversation: Types.ObjectId
	sender: Types.ObjectId
	content: string
	readBy: Types.ObjectId[]
	createdAt: Date
	updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
	{
		conversation: {
			type: Schema.Types.ObjectId,
			ref: 'Conversation',
			required: true,
			index: true,
		},
		sender: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			autopopulate: {
				select: 'username profilePicture name',
			},
		},
		content: {
			type: String,
			required: [true, 'Message content is required'],
			trim: true,
			maxlength: [1000, 'Message cannot exceed 1000 characters'],
		},
		readBy: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
				autopopulate: {
					select: 'username',
				},
			},
		],
	},
	{
		timestamps: true,
	}
)

// Indexes
MessageSchema.index({ conversation: 1, createdAt: -1 })
MessageSchema.index({ sender: 1, createdAt: -1 })

// Plugin
MessageSchema.plugin(autopopulate)

export const Message = model<IMessage>('Message', MessageSchema)
