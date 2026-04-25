import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function generateComponentSchema(userPrompt: string) {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a UI component generator. Given a user description, return ONLY a valid JSON object with this exact structure:
{
  "id": "unique_id",
  "version": "1.0",
  "layout": "stack",
  "components": [
    {
      "type": "button|input|card|list|badge",
      "id": "unique_id",
      "props": {}
    }
  ]
}
Return only JSON, no explanation, no markdown, no code blocks.`,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  })

  const content = response.choices[0].message.content || ''
  const cleaned = content.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}