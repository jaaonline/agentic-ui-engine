import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function generateUI(prompt: string, userId?: number) {
  const response = await axios.post(`${API_URL}/api/generate`, { prompt, userId })
  console.log('AI Response:', JSON.stringify(response.data.schema, null, 2))
  return response.data.schema
}