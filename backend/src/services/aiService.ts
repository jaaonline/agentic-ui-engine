import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

function normalizeSchema(raw: any) {
  if (!raw || !raw.components) return raw

  const components = raw.components.map((comp: any, index: number) => {
    if (comp.props && typeof comp.props === 'object') {
      return {
        ...comp,
        id: comp.id || `${comp.type}_${index}`,
      }
    }

    const { type, id, ...rest } = comp
    return {
      type,
      id: id || `${type}_${index}`,
      props: rest,
    }
  })

  const buttonIds = components
    .filter((c: any) => c.type === 'button')
    .map((c: any) => c.id)

  const inputIds = components
    .filter((c: any) => c.type === 'input')
    .map((c: any) => c.id)

  const interactions = (raw.interactions || []).map((interaction: any) => ({
    ...interaction,
    sourceId: buttonIds[0] || interaction.sourceId,
    targetId: inputIds.join('|') || interaction.targetId,
  }))

  const seen = new Set()
  const dedupedInteractions = interactions.filter((interaction: any) => {
    if (seen.has(interaction.action)) return false
    seen.add(interaction.action)
    return true
  })

  if (dedupedInteractions.length === 0 && buttonIds.length > 0 && inputIds.length > 0) {
    dedupedInteractions.push({
      trigger: 'click',
      sourceId: buttonIds[0],
      action: 'submit',
      targetId: inputIds[0],
      successMessage: 'Submitted successfully!',
      errorMessage: 'Please fill in all required fields.',
    })
  }

  return {
    ...raw,
    components,
    interactions: dedupedInteractions,
  }
}

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
      "type": "button|input|card|list|badge|hero|stat|avatar|divider",
      "id": "unique_id",
      "props": {}
    }
  ],
  "interactions": []
}

Component props:
- button: { label, variant: "primary|outline|ghost", fullWidth: true|false }
- input: { label, placeholder, inputType: "text|email|password|number", required: true|false }
- card: { title, subtitle, description, footer }
- list: { items: ["item1", "item2"] }
- badge: { label, variant: "success|error|warning|default" }
- hero: { title, subtitle, ctaLabel }
- stat: { label, value, change, trend: "up|down" }
- avatar: { name, role, initials }
- divider: { label }

Interactions: { trigger: "click", sourceId, action: "validate|submit|toggle|reset", targetId, successMessage, errorMessage }

Return ONLY JSON, no explanation, no markdown, no code blocks.`,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  })

  const content = response.choices[0].message.content || ''
  const cleaned = content.replace(/```json|```/g, '').trim()
  const raw = JSON.parse(cleaned)
  return normalizeSchema(raw)
}