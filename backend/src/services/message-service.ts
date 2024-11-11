import { BaseService } from './base-service'
import { IMessage, Message } from '../models'

export class MessageService extends BaseService<IMessage> {
	constructor() {
		super(Message)
	}
}
