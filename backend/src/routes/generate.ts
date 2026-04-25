import { Router, Request, Response } from 'express'
import { generateComponentSchema } from '../services/aiService'

export const generateRoute = Router()

generateRoute.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' })
      return
    }

    const schema = await generateComponentSchema(prompt)
    res.json({ schema })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to generate component' })
  }
})