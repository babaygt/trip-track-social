import request from 'supertest'
import app from '../../src/app'
import { User, IUser } from '../../src/models'
import { UserService } from '../../src/services/user-service'
import express, { NextFunction } from 'express'
import router from '../../src/routes/auth-routes'
import { Request, Response } from 'express'
import session, { Session, SessionData } from 'express-session'
import { AuthService } from '../../src/services/auth-service'

describe('Auth Routes', () => {
	let userService: UserService

	beforeEach(() => {
		userService = new UserService()
	})

	describe('POST /auth/login', () => {
		const validUserData = {
			name: 'Test User',
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123',
			bio: 'Test bio',
		}

		it('should login successfully with valid credentials', async () => {
			// Create a test user first
			await userService.createUser(validUserData)

			const response = await request(app)
				.post('/auth/login')
				.send({
					email: validUserData.email,
					password: validUserData.password,
				})
				.expect(200)

			expect(response.body).toEqual({
				__v: expect.any(Number),
				_id: expect.any(String),
				bio: validUserData.bio,
				bookmarks: [],
				conversations: [],
				createdAt: expect.any(String),
				email: validUserData.email,
				followers: [],
				following: [],
				isAdmin: false,
				isProtected: false,
				name: validUserData.name,
				profilePicture: expect.any(String),
				updatedAt: expect.any(String),
				username: validUserData.username,
			})
		})

		it('should return 400 with invalid email format', async () => {
			const response = await request(app)
				.post('/auth/login')
				.send({
					email: 'invalid-email',
					password: 'password123',
				})
				.expect(400)

			expect(response.body).toHaveProperty('errors')
		})

		it('should return 400 with empty password', async () => {
			const response = await request(app)
				.post('/auth/login')
				.send({
					email: 'test@example.com',
					password: '',
				})
				.expect(400)

			expect(response.body).toHaveProperty('errors')
		})

		it('should return 401 with non-existent email', async () => {
			const response = await request(app)
				.post('/auth/login')
				.send({
					email: 'nonexistent@example.com',
					password: 'password123',
				})
				.expect(401)

			expect(response.body).toEqual({
				message: 'Invalid credentials',
			})
		})

		it('should return 401 with incorrect password', async () => {
			// Create a test user first
			await userService.createUser(validUserData)

			const response = await request(app)
				.post('/auth/login')
				.send({
					email: validUserData.email,
					password: 'wrongpassword',
				})
				.expect(401)

			expect(response.body).toEqual({
				message: 'Invalid credentials',
			})
		})

		afterEach(async () => {
			await User.deleteMany({})
		})
	})

	describe('POST /auth/logout', () => {
		it('should successfully log out user', async () => {
			const response = await request(app).post('/auth/logout').expect(200)

			expect(response.body).toEqual({
				message: 'Logged out successfully',
			})

			// Verify cookie is cleared
			expect(response.headers['set-cookie'][0]).toContain('connect.sid=;')
		})

		it('should handle session destruction error', async () => {
			// Mock express-session by extending the request object
			const mockSession = {
				destroy: (callback: (err: Error) => void) => {
					callback(new Error('Session destruction failed'))
				},
				id: '123',
				cookie: {
					maxAge: 3600000,
				},
				regenerate: (callback: (err: Error | null) => void) => callback(null),
				reload: (callback: (err: Error | null) => void) => callback(null),
				save: (callback: (err: Error | null) => void) => callback(null),
				touch: () => {},
			} as Session

			// Use jest to spy on the session middleware
			const originalSession = (
				req: Request & { session: typeof mockSession },
				_: Response,
				next: NextFunction
			) => {
				req.session = mockSession
				next()
			}

			// Create a new instance of the app with the mocked session
			const mockApp = express()
			mockApp.use(originalSession)
			mockApp.use('/auth', router)

			const response = await request(mockApp).post('/auth/logout').expect(500)

			expect(response.body).toEqual({
				message: 'Could not log out',
			})
		})
	})

	describe('GET /auth/session', () => {
		it('should return the current session if user is logged in', async () => {
			// Mock session middleware
			const mockSession = {
				userId: 'validUserId',
				isAdmin: false,
				save: (cb: (err: Error | null) => void) => cb(null),
				regenerate: (cb: (err: Error | null) => void) => cb(null),
				destroy: (cb: (err: Error | null) => void) => cb(null),
				reload: (cb: (err: Error | null) => void) => cb(null),
				touch: () => {},
				cookie: {
					maxAge: 3600000,
				},
				id: 'test-session-id',
			} as Session & Partial<SessionData>

			// Create test user
			const testUser = await userService.createUser({
				name: 'Test User',
				username: 'testuser',
				email: 'test@example.com',
				password: 'password123',
				bio: 'Test bio',
			})

			// Mock AuthService validateSession method
			jest.spyOn(AuthService.prototype, 'validateSession').mockResolvedValue({
				id: testUser.id,
				name: testUser.name,
				email: testUser.email,
				isAdmin: false,
			} as IUser)

			const mockApp = express()
			mockApp.use(
				session({
					secret: 'test',
					resave: false,
					saveUninitialized: false,
				})
			)
			mockApp.use((req, _, next) => {
				req.session = mockSession
				next()
			})
			mockApp.use('/auth', router)

			const response = await request(mockApp).get('/auth/session').expect(200)

			expect(response.body).toEqual({
				id: expect.any(String),
				name: expect.any(String),
				email: expect.any(String),
				isAdmin: false,
			})
		}, 15000) // Increased timeout to 15 seconds

		it('should return 401 if no active session', async () => {
			const response = await request(app).get('/auth/session').expect(401)

			expect(response.body).toEqual({
				message: 'No active session',
			})
		})
	})
})
