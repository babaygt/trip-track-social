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

		return this.create({
			conversation: new Types.ObjectId(conversationId),
			sender: new Types.ObjectId(senderId),
			content,
			readBy: [new Types.ObjectId(senderId)], // Mark as read by sender
		})
	}

	async markAsRead(messageId: string, userId: string): Promise<IMessage> {
		if (!Types.ObjectId.isValid(messageId) || !Types.ObjectId.isValid(userId)) {
			throw new Error('Invalid ID format')
		}

		const message = await this.findById(messageId)
		if (!message) {
			throw new Error('Message not found')
		}

		const isAlreadyRead = message.readBy.some(
			(readerId) => readerId._id.toString() === userId
		)

		if (isAlreadyRead) {
			return message
		}

		const updatedMessage = await this.update(messageId, {
			$push: { readBy: new Types.ObjectId(userId) },
		})

		if (!updatedMessage) throw new Error('Failed to mark message as read')
		return updatedMessage
	}
}
