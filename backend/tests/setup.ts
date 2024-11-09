import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import dotenv from 'dotenv'

// Load test environment variables
dotenv.config({ path: '.env.test' })

let mongod: MongoMemoryServer

beforeAll(async () => {
	mongod = await MongoMemoryServer.create()
	const uri = mongod.getUri()
	await mongoose.connect(uri)
})

beforeEach(() => {
	jest.clearAllMocks()
})

afterAll(async () => {
	await mongoose.connection.dropDatabase()
	await mongoose.connection.close()
	await mongod.stop()
})

afterEach(async () => {
	const collections = mongoose.connection.collections
	for (const key in collections) {
		const collection = collections[key]
		await collection.deleteMany({})
	}
})
