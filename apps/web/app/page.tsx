'use client'

import { useState } from 'react'
import { generateUI } from '@/lib/api'
import { DSLRenderer } from '@/components/renderer/DSLRenderer'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [schema, setSchema] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    try {
      const result = await generateUI(prompt)
      setSchema(result)
    } catch (e) {
      setError('Failed to generate UI. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agentic UI Engine</h1>
        <p className="text-gray-500 mb-8">Describe a UI component in natural language</p>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. make a login form with email and password"
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {schema && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide">Preview</p>
            <DSLRenderer schema={schema} />
          </div>
        )}
      </div>
    </main>
  )
}