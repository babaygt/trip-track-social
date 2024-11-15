import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { config } from 'dotenv'

config({ path: '.env.test' })

let mongod: MongoMemoryServer

beforeAll(async () => {
	jest.setTimeout(30000)
	mongod = await MongoMemoryServer.create()
	const uri = mongod.getUri()

	// Close any existing connections
	await mongoose.disconnect()

	// Connect to the in-memory database
	await mongoose.connect(uri)
})

beforeEach(async () => {
	// Clear all collections
	const collections = mongoose.connection.collections
	for (const key in collections) {
		const collection = collections[key]
		await collection.deleteMany({})
	}
	jest.clearAllMocks()
})

afterAll(async () => {
	if (mongod) {
		await mongoose.disconnect()
		await mongod.stop()
	}
})
