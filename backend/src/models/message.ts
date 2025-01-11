import { Schema, model, Document, Types } from 'mongoose'

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
			index: true,
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
			},
		],
	},
	{
		timestamps: true,
	}
)

// Indexes for better query performance
MessageSchema.index({ conversation: 1, createdAt: -1 })
MessageSchema.index({ sender: 1, createdAt: -1 })
MessageSchema.index({ readBy: 1 })
MessageSchema.index({ conversation: 1, sender: 1, createdAt: -1 })

export const Message = model<IMessage>('Message', MessageSchema)
