import mongoose from 'mongoose'
import env from '../util/validate-env'

const connectionString =
	env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/trip-track'

export const connectToDatabase = async () => {
	try {
		await mongoose.connect(connectionString)
		console.log('Database connection established.')
	} catch (err) {
		console.error('Database connection failed:', err)
	}
}
