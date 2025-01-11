import { cleanEnv } from 'envalid'
import { port, str } from 'envalid/dist/validators'

export default cleanEnv(process.env, {
	MONGODB_CONNECTION_STRING: str(),
	PORT: port(),
	SESSION_SECRET: str(),
	UPLOADTHING_SECRET: str(),
	UPLOADTHING_APP_ID: str(),
	UPLOADTHING_TOKEN: str(),
})
