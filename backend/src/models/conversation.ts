import { Schema, model, Document, Types } from 'mongoose'

export interface IConversation extends Document {
	participants: Types.ObjectId[]
	lastMessage: Types.ObjectId
	updatedAt: Date
	createdAt: Date
}

const ConversationSchema = new Schema<IConversation>(
	{
		participants: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true,
				index: true,
			},
		],
		lastMessage: {
			type: Schema.Types.ObjectId,
			ref: 'Message',
			index: true,
		},
	},
	{
		timestamps: true,
	}
)

// Ensure at least 2 participants
ConversationSchema.pre('save', function (next) {
	if (this.participants.length < 2) {
		next(new Error('Conversation must have at least 2 participants'))
	} else {
		next()
	}
})

// Indexes for better query performance
ConversationSchema.index({ participants: 1 })
ConversationSchema.index({ updatedAt: -1 })
ConversationSchema.index({ participants: 1, updatedAt: -1 })
ConversationSchema.index({ lastMessage: 1, updatedAt: -1 })

export const Conversation = model<IConversation>(
	'Conversation',
	ConversationSchema
)
