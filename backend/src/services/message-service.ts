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
}
