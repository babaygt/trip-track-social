import { BaseService } from './base-service'
import { IUser, User } from '../models'

export class UserService extends BaseService<IUser> {
	constructor() {
		super(User)
	}
}
