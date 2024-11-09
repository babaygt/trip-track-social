import { Schema, model, Document, Types } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

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
				autopopulate: {
					select: 'username profilePicture name',
				},
			},
		],
		lastMessage: {
			type: Schema.Types.ObjectId,
			ref: 'Message',
			autopopulate: true,
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

// Indexes
ConversationSchema.index({ participants: 1 })
ConversationSchema.index({ updatedAt: -1 })

// Compound index for finding conversations between specific users
ConversationSchema.index({ participants: 1, updatedAt: -1 })

// Plugin
ConversationSchema.plugin(autopopulate)

export const Conversation = model<IConversation>(
	'Conversation',
	ConversationSchema
)
