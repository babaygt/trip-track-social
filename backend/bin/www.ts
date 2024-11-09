import app from '../src/app'
import env from '../src/util/validate-env'
import { connectToDatabase } from '../src/config/database-connection'

const PORT = env.PORT || 3000

const start = async () => {
	try {
		await connectToDatabase()
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`)
		})
	} catch (error) {
		console.error('Failed to start server:', error)
		process.exit(1)
	}
}

start()
