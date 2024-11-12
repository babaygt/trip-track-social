import MongoStore from 'connect-mongo'
import env from '../util/validate-env'

export const sessionConfig = {
	secret: env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({
		mongoUrl: env.MONGODB_CONNECTION_STRING,
		collectionName: 'sessions',
	}),
	cookie: {
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
		sameSite:
			process.env.NODE_ENV === 'production'
				? ('strict' as const)
				: ('lax' as const),
	},
}
