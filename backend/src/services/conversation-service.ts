import { BaseService } from './base-service'
import { IConversation, Conversation } from '../models'

export class ConversationService extends BaseService<IConversation> {
	constructor() {
		super(Conversation)
	}
}
