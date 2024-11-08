import express, { Request, Response } from 'express'

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
	res.sendFile('index.html', { root: 'views' })
})

export default router
