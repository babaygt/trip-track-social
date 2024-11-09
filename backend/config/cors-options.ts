import { allowedOrigins } from './allowed-origins'

type CorsOptions = {
	origin: (
		origin: string | undefined,
		callback: (err: Error | null, allow?: boolean) => void
	) => void
	credentials: boolean
	optionsSuccessStatus: number
}

const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
	credentials: true,
	optionsSuccessStatus: 200,
}

export default corsOptions
