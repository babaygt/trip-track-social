import mongoose from 'mongoose'
import env from '../util/validate-env'

const connectionString = env.MONGODB_CONNECTION_STRING

export const connectToDatabase = async () => {
	try {
		console.log('Attempting database connection...')
		await mongoose.connect(connectionString, {
			serverSelectionTimeoutMS: 15000,
			socketTimeoutMS: 45000,
			connectTimeoutMS: 30000,
			waitQueueTimeoutMS: 30000,
		})
		console.log('Database connection established.')
	} catch (err) {
		console.error('Database connection failed with error:', err)
		throw err
	}
}
