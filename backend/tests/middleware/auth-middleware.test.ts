import { Request, Response, NextFunction } from 'express'
import { isAuthenticated } from '../../src/middleware/auth-middleware'
import { AuthService } from '../../src/services/auth-service'
import { Session, SessionData } from 'express-session'
import { IUser } from '../../src/models'

jest.mock('../../src/services/auth-service')

describe('Auth Middleware', () => {
	let mockRequest: Partial<Request>
	let mockResponse: Partial<Response>
	let nextFunction: NextFunction

	beforeEach(() => {
		mockRequest = {
			session: {} as Session & Partial<SessionData>,
		}
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		}
		nextFunction = jest.fn()
	})

	it('should call next() when session is valid', async () => {
		mockRequest.session = {
			userId: 'valid-user-id',
			isAdmin: false,
		} as Session & Partial<SessionData>

		// Mock validateSession to resolve successfully
		jest.spyOn(AuthService.prototype, 'validateSession').mockResolvedValue({
			id: 'valid-user-id',
			name: 'Test User',
			email: 'test@example.com',
			isAdmin: false,
		} as IUser)

		await isAuthenticated(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		)

		expect(nextFunction).toHaveBeenCalled()
		expect(mockResponse.status).not.toHaveBeenCalled()
		expect(mockResponse.json).not.toHaveBeenCalled()
	})

	it('should return 401 when no userId in session', async () => {
		await isAuthenticated(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		)

		expect(mockResponse.status).toHaveBeenCalledWith(401)
		expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
		expect(nextFunction).not.toHaveBeenCalled()
	})

	it('should return 401 when validateSession fails', async () => {
		mockRequest.session = {
			userId: 'invalid-user-id',
			isAdmin: false,
		} as Session & Partial<SessionData>

		// Mock validateSession to reject
		jest
			.spyOn(AuthService.prototype, 'validateSession')
			.mockRejectedValue(new Error('Invalid session'))

		await isAuthenticated(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		)

		expect(mockResponse.status).toHaveBeenCalledWith(401)
		expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid session' })
		expect(nextFunction).not.toHaveBeenCalled()
	})
})
