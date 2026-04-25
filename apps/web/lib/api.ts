import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function generateUI(prompt: string) {
  const response = await axios.post(`${API_URL}/api/generate`, { prompt })
  return response.data.schema
}