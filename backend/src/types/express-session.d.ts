import 'express-session'

declare module 'express-session' {
	export interface Session {
		userId: string
		isAdmin: boolean
	}

	export interface SessionData {
		userId: string
		isAdmin: boolean
	}
}
