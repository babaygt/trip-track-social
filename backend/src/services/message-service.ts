import { BaseService } from './base-service'
import { IMessage, Message } from '../models'
import { Types } from 'mongoose'

export class MessageService extends BaseService<IMessage> {
	constructor() {
		super(Message)
	}

	async createMessage(
		conversationId: string,
		senderId: string,
		content: string
	): Promise<IMessage> {
		if (
			!Types.ObjectId.isValid(conversationId) ||
			!Types.ObjectId.isValid(senderId)
		) {
			throw new Error('Invalid ID format')
		}

		const message = await this.model.create({
			conversation: new Types.ObjectId(conversationId),
			sender: new Types.ObjectId(senderId),
			content,
			readBy: [new Types.ObjectId(senderId)], // Mark as read by sender
		})

		return this.model
			.findById(message._id)
			.populate('sender', 'name username profilePicture')
			.populate('readBy', 'name username profilePicture')
			.then((doc) => doc!)
	}

	async markAsRead(messageId: string, userId: string): Promise<IMessage> {
		if (!Types.ObjectId.isValid(messageId) || !Types.ObjectId.isValid(userId)) {
			throw new Error('Invalid ID format')
		}

		const message = await this.model
			.findById(messageId)
			.populate('sender', 'name username profilePicture')
			.populate('readBy', 'name username profilePicture')

		if (!message) {
			throw new Error('Message not found')
		}

		const isAlreadyRead = message.readBy.some(
			(reader) => reader._id.toString() === userId
		)

		if (isAlreadyRead) {
			return message
		}

		const updatedMessage = await this.model
			.findByIdAndUpdate(
				messageId,
				{ $push: { readBy: new Types.ObjectId(userId) } },
				{ new: true }
			)
			.populate('sender', 'name username profilePicture')
			.populate('readBy', 'name username profilePicture')

		if (!updatedMessage) throw new Error('Failed to mark message as read')
		return updatedMessage
	}

	async getMessagesByConversation(
		conversationId: string,
		page: number = 1,
		limit: number = 50
	) {
		if (!Types.ObjectId.isValid(conversationId)) {
			throw new Error('Invalid conversation ID format')
		}

		const [total, data] = await Promise.all([
			this.model.countDocuments({ conversation: conversationId }),
			this.model
				.find({ conversation: conversationId })
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.populate('sender', 'name username profilePicture')
				.populate('readBy', 'name username profilePicture'),
		])

		return {
			data,
			total,
			pages: Math.ceil(total / limit),
		}
	}
}
