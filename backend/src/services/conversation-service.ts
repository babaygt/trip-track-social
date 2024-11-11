import { BaseService } from './base-service'
import { IConversation, Conversation } from '../models'
import { Types } from 'mongoose'

export class ConversationService extends BaseService<IConversation> {
	constructor() {
		super(Conversation)
	}

	async createConversation(participantIds: string[]): Promise<IConversation> {
		if (participantIds.length < 2) {
			throw new Error('Conversation must have at least 2 participants')
		}

		if (!participantIds.every((id) => Types.ObjectId.isValid(id))) {
			throw new Error('Invalid participant ID format')
		}

		const participants = participantIds.map((id) => new Types.ObjectId(id))

		// Check if conversation already exists between these participants
		const existingConversation = await this.findOne({
			participants: { $all: participants, $size: participants.length },
		})

		if (existingConversation) {
			return existingConversation
		}

		return this.create({ participants })
	}
}
