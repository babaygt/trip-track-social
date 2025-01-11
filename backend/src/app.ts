import express, { Express } from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'
import cors from 'cors'
import corsOptions from './config/cors-options'
import indexRouter from './routes/index'
import userRouter from './routes/user-routes'
import routeRoutes from './routes/route-routes'
import messageRoutes from './routes/message-routes'
import conversationRoutes from './routes/conversation-routes'
import session from 'express-session'
import { sessionConfig } from './config/session-config'
import authRouter from './routes/auth-routes'
import { createRouteHandler } from 'uploadthing/express'
import { uploadRouter } from './config/uploadthing'

dotenv.config()

const app: Express = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors(corsOptions))
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(session(sessionConfig))

app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/routes', routeRoutes)
app.use('/messages', messageRoutes)
app.use('/conversations', conversationRoutes)
app.use('/auth', authRouter)
app.use(
	'/api/uploadthing',
	createRouteHandler({
		router: uploadRouter,
	})
)
app.all('*', (req, res) => {
	res.status(404)
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', 'error.html'))
	} else if (req.accepts('json')) {
		res.json({ message: '404 Not Found' })
	} else {
		res.type('txt').send('404 Not Found')
	}
})

export default app
