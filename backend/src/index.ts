import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateRoute } from './routes/generate'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: '*'
}))
app.use(express.json())

app.use('/api', generateRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})