import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Trip Track API',
			version: '1.0.0',
			description: 'API documentation for Trip Track application',
			contact: {
				name: 'API Support',
				email: 'yigitbaba.contact@gmail.com',
			},
			license: {
				name: 'MIT',
				url: 'https://github.com/babaygt/trip-track-social/blob/main/LICENSE',
			},
		},
		servers: [
			{
				url: 'http://localhost:8080',
				description: 'Development server (Docker)',
			},
			{
				url: process.env.CLOUD_RUN_URL || 'https://your-app-name.run.app',
				description: 'Production server (Google Cloud Run)',
			},
		],
		components: {
			schemas: {
				Point: {
					type: 'object',
					properties: {
						_id: { type: 'string' },
						lat: { type: 'number' },
						lng: { type: 'number' },
					},
				},
				User: {
					type: 'object',
					properties: {
						_id: { type: 'string' },
						name: { type: 'string' },
						username: { type: 'string' },
						email: { type: 'string', format: 'email' },
						bio: { type: 'string' },
						profilePicture: { type: 'string' },
						followers: {
							type: 'array',
							items: { type: 'string' },
						},
						following: {
							type: 'array',
							items: { type: 'string' },
						},
						bookmarks: {
							type: 'array',
							items: { type: 'string' },
						},
						isAdmin: { type: 'boolean' },
						isProtected: { type: 'boolean' },
					},
				},
				Route: {
					type: 'object',
					properties: {
						_id: { type: 'string' },
						title: { type: 'string' },
						description: { type: 'string' },
						creator: {
							$ref: '#/components/schemas/User',
						},
						points: {
							type: 'array',
							items: { $ref: '#/components/schemas/Point' },
						},
						likes: {
							type: 'array',
							items: { type: 'string' },
						},
						comments: {
							type: 'array',
							items: { $ref: '#/components/schemas/Comment' },
						},
						distance: { type: 'number' },
						duration: { type: 'number' },
						isPublic: { type: 'boolean' },
					},
				},
				Comment: {
					type: 'object',
					properties: {
						_id: { type: 'string' },
						content: { type: 'string' },
						user: {
							$ref: '#/components/schemas/User',
						},
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				Message: {
					type: 'object',
					properties: {
						_id: { type: 'string' },
						content: { type: 'string' },
						sender: {
							$ref: '#/components/schemas/User',
						},
						conversation: { type: 'string' },
						readBy: {
							type: 'array',
							items: { type: 'string' },
						},
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				Conversation: {
					type: 'object',
					properties: {
						_id: { type: 'string' },
						participants: {
							type: 'array',
							items: { $ref: '#/components/schemas/User' },
						},
						lastMessage: {
							$ref: '#/components/schemas/Message',
						},
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
			},
			securitySchemes: {
				sessionAuth: {
					type: 'apiKey',
					in: 'cookie',
					name: 'connect.sid',
				},
			},
		},
		tags: [
			{ name: 'Auth', description: 'Authentication endpoints' },
			{ name: 'Users', description: 'User management endpoints' },
			{ name: 'Routes', description: 'Route management endpoints' },
			{ name: 'Messages', description: 'Message management endpoints' },
			{
				name: 'Conversations',
				description: 'Conversation management endpoints',
			},
		],
	},
	apis: ['./src/routes/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
