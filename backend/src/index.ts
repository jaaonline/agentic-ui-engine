import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import express from 'express'
import cors from 'cors'
import { generateRoute } from './routes/generate'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use('/api', generateRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})