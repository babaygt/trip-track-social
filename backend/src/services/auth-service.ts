import { UserService } from './user-service'

export class AuthService {
	private userService: UserService

	constructor() {
		this.userService = new UserService()
	}
}
