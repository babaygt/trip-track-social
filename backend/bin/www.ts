import app from '../src/app'
import env from '../src/util/validate-env'

const PORT = env.PORT || 3000

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
