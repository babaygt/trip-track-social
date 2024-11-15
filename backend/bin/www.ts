import app from '../src/app'
import env from '../src/util/validate-env'
import { connectToDatabase } from '../src/config/database-connection'

const PORT = env.PORT || 8080
const HOST = '0.0.0.0'

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason)
	process.exit(1)
})

const start = async () => {
	try {
		console.log('Starting server with environment:', process.env.NODE_ENV)
		console.log('Environment variables loaded:', {
			port: PORT,
			host: HOST,
			nodeEnv: process.env.NODE_ENV,
			mongoDbConnected: !!env.MONGODB_CONNECTION_STRING,
			sessionSecretSet: !!env.SESSION_SECRET,
		})

		console.log('Connecting to database...')
		await connectToDatabase()

		const server = app.listen(PORT, HOST, () => {
			console.log(`Server running on http://${HOST}:${PORT}`)
		})

		server.on('error', (error: NodeJS.ErrnoException) => {
			console.error('Server error:', error)
			process.exit(1)
		})
	} catch (error) {
		console.error('Failed to start server:', error)
		process.exit(1)
	}
}

start()
