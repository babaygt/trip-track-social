import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth-service'

declare module 'express-session' {
	interface SessionData {
		userId: string
		isAdmin: boolean
	}
}

const authService = new AuthService()

export const isAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.session.userId) {
			return res.status(401).json({ message: 'Unauthorized' })
		}

		await authService.validateSession(req.session.userId)
		next()
	} catch (error) {
		res.status(401).json({
			error:
				error instanceof Error ? error.message : 'An unknown error occurred',
		})
	}
}
