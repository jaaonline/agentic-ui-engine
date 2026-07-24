import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

const JAVA_BACKEND_URL = process.env.JAVA_BACKEND_URL || 'http://localhost:8080'

// Tool definition exposed to the model. The model decides on its own
// whether a given prompt is worth checking against past generations —
// e.g. "login form" is worth checking, "a UI with a pink dinosaur" isn't.
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_component_history',
      description:
        "Search the current user's past generations for a component similar to what they're asking for now, so it can be reused or adapted instead of generated from scratch.",
      parameters: {
        type: 'object',
        properties: {
          queryText: {
            type: 'string',
            description:
              'A natural-language description of the component being requested, e.g. "a login form with email and password fields"',
          },
        },
        required: ['queryText'],
      },
    },
  },
]

interface HistoryEntry {
  prompt: string
  schema: string
}

async function fetchUserHistory(userId: number): Promise<HistoryEntry[]> {
  try {
    const res = await fetch(`${JAVA_BACKEND_URL}/api/history/user/${userId}`)
    if (!res.ok) return []
    return (await res.json()) as HistoryEntry[]
  } catch (err) {
    console.error('Failed to fetch generation history:', err)
    return []
  }
}

// In-memory cache so repeated requests within the same process don't
// re-embed the same past prompt over and over. Cleared on restart — fine
// for a demo/portfolio project, would move to a real vector store (e.g.
// pgvector) for anything long-running.
const embeddingCache = new Map<string, number[]>()

async function getEmbedding(text: string): Promise<number[]> {
  const cached = embeddingCache.get(text)
  if (cached) return cached

  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  const vector = response.data[0].embedding
  embeddingCache.set(text, vector)
  return vector
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

const SIMILARITY_THRESHOLD = 0.6

// Real semantic retrieval: embed the query and every past prompt, rank by
// cosine similarity, keep only matches above a similarity floor so
// unrelated history doesn't get pulled in just because it's "least bad".
async function findSimilarHistory(history: HistoryEntry[], queryText: string): Promise<HistoryEntry[]> {
  if (history.length === 0) return []

  const queryEmbedding = await getEmbedding(queryText)

  const scored = await Promise.all(
    history.map(async (entry) => ({
      entry,
      score: cosineSimilarity(queryEmbedding, await getEmbedding(entry.prompt)),
    }))
  )

  return scored
    .filter((s) => s.score >= SIMILARITY_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.entry)
}

interface PlannedComponent {
  type: string
  purpose: string
}

// Step 1 — task decomposition. A cheap, separate call that breaks the
// user's one-line request into an explicit list of components before any
// generation happens, so the main call has a concrete plan to follow
// instead of guessing structure and content at the same time.
async function planComponents(userPrompt: string): Promise<PlannedComponent[]> {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Break the user's UI request into a short list of the components needed to fulfill it. Valid types: button, input, card, list, badge, hero, stat, avatar, divider, table, navbar, alert, progress.

Return ONLY JSON: { "components": [{ "type": "...", "purpose": "one short phrase" }] }`,
        },
        { role: 'user', content: userPrompt },
      ],
    })
    const content = response.choices[0].message.content || '{}'
    const cleaned = content.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    return parsed.components || []
  } catch (err) {
    // Planning is an optimization, not a requirement — if it fails,
    // generation falls back to working from the raw prompt alone.
    console.error('Planning step failed:', err)
    return []
  }
}

// Step 3 — validation + repair. Checks the generated schema against the
// plan from step 1, and if a planned component type never made it into
// the output, asks the model to add just the missing pieces rather than
// regenerating (and possibly breaking) everything.
async function repairMissingComponents(
  schema: any,
  plan: PlannedComponent[],
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
) {
  if (plan.length === 0) return schema

  const presentTypes = new Set((schema.components || []).map((c: any) => c.type))
  const missing = plan.filter((p) => !presentTypes.has(p.type))
  if (missing.length === 0) return schema

  messages.push({ role: 'assistant', content: JSON.stringify(schema) })
  messages.push({
    role: 'user',
    content: `The plan called for these components that are missing from your output: ${JSON.stringify(
      missing
    )}. Return the COMPLETE updated JSON (all existing components plus the missing ones added), same format as before. Return ONLY JSON.`,
  })

  const repairResponse = await client.chat.completions.create({
    model: 'gpt-4o',
    messages,
  })
  const content = repairResponse.choices[0].message.content || ''
  const cleaned = content.replace(/```json|```/g, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    // If the repair pass returns something unparseable, the original
    // (incomplete but valid) schema is safer to ship than nothing.
    return schema
  }
}

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

const SYSTEM_PROMPT = `You are an expert UI component generator. Generate realistic, production-quality UI components with real content — never use placeholder text like "Item 1" or "Notification 1".

Before generating, consider calling search_component_history if the request resembles something a user might have asked for before (e.g. "login form", "dashboard") — reusing or adapting a past component is preferable to generating a near-duplicate from scratch. Skip the tool for requests unlikely to have a precedent.

When you are ready to output the component, return ONLY a valid JSON object with this exact structure:
{
  "id": "unique_id",
  "version": "1.0",
  "layout": "stack",
  "components": [
    {
      "type": "component_type",
      "id": "unique_id",
      "props": {}
    }
  ],
  "interactions": []
}

Component types and props:
- button: { label, variant: "primary|outline|ghost", fullWidth: true|false }
- input: { label, placeholder, inputType: "text|email|password|number", required: true|false }
- card: { title, subtitle, description, footer }
- list: { items: ["realistic item 1", "realistic item 2"] }
- badge: { label, variant: "success|error|warning|default" }
- hero: { title, subtitle, ctaLabel }
- stat: { label, value, change, trend: "up|down" }
- avatar: { name, role, initials }
- divider: { label }
- table: { columns: ["Col1", "Col2"], rows: [["val1", "val2"]] }
- navbar: { brand, links: ["Home", "About"] }
- alert: { message, variant: "success|error|warning|info" }
- progress: { label, value: 0-100, variant: "default|success|warning" }

Rules:
- Use REAL, contextually appropriate content (e.g. for a user table: real names, emails, roles)
- For forms: inputs + submit button + submit interaction
- For dashboards: stats (grid) + table or list
- For profiles: avatar + badge + card + button
- For landing pages: hero + list + button
- Always include interactions array
- Every component must have a unique id

When your final reply is the component, return ONLY JSON, no explanation, no markdown.`

export async function generateComponentSchema(userPrompt: string, userId?: number) {
  // Step 1: decompose the request into a plan before generating anything.
  const plan = await planComponents(userPrompt)
  const planContext = plan.length
    ? `\n\nPlan for this request (make sure every one of these appears in your output):\n${plan
        .map((p) => `- ${p.type}: ${p.purpose}`)
        .join('\n')}`
    : ''

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT + planContext },
    { role: 'user', content: userPrompt },
  ]

  // Step 2: generate, with the existing tool-calling flow for history reuse.
  const firstResponse = await client.chat.completions.create({
    model: 'gpt-4o',
    messages,
    tools: userId ? tools : undefined,
  })

  const message = firstResponse.choices[0].message
  const toolCalls = (message.tool_calls ?? []).filter(
    (tc): tc is OpenAI.Chat.Completions.ChatCompletionMessageFunctionToolCall => tc.type === 'function'
  )

  let content = message.content || ''

  if (toolCalls.length > 0) {
    messages.push(message)

    for (const toolCall of toolCalls) {
      if (toolCall.function.name === 'search_component_history' && userId) {
        const { queryText } = JSON.parse(toolCall.function.arguments) as { queryText: string }
        const history = await fetchUserHistory(userId)
        const matches = await findSimilarHistory(history, queryText)
        console.log('RAG query:', queryText, '-> matches:', matches.map(m => m.prompt))

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: matches.length
            ? JSON.stringify(matches.map((m) => ({ prompt: m.prompt, schema: m.schema })))
            : 'No similar past components found.',
        })
      } else {
        // Every tool_call_id must get a response or the next API call is
        // rejected outright — even calls we don't recognize or can't run.
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: 'Tool unavailable.',
        })
      }
    }

    const secondResponse = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
    })
    content = secondResponse.choices[0].message.content || ''
  }

  const cleaned = content.replace(/```json|```/g, '').trim()
  let raw = JSON.parse(cleaned)

  // Step 3: validate against the plan and repair anything missing.
  raw = await repairMissingComponents(raw, plan, messages)

  return normalizeSchema(raw)
}