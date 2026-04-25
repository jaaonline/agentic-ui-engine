'use client'

import { useState } from 'react'
import { generateUI } from '@/lib/api'
import { DSLRenderer } from '@/components/renderer/DSLRenderer'
import { CodeExport } from '@/components/renderer/CodeExport'

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
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-xs font-bold">A</div>
          <span className="font-semibold text-sm tracking-tight">Agentic UI Engine</span>
        </div>
        <span className="text-xs text-white/30">v1.0.0</span>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            Describe UI,<br />watch it appear.
          </h1>
          <p className="text-white/40 text-lg">
            Natural language to interactive components, instantly.
          </p>
        </div>

        {/* Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. a signup form with name, email, and a submit button"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all pr-32"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-medium px-5 rounded-lg transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Generating
              </span>
            ) : 'Generate →'}
          </button>
        </div>

        {/* Example prompts */}
        <div className="flex gap-2 flex-wrap mb-12">
          {[
            'login form with email and password',
            'pricing card with title and CTA',
            'user profile card',
            'notification badge list',
          ].map((example) => (
            <button
              key={example}
              onClick={() => setPrompt(example)}
              className="text-xs text-white/30 hover:text-white/60 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-full transition-all"
            >
              {example}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Preview */}
        {schema && (
          <div className="border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20"/>
                <div className="w-2.5 h-2.5 rounded-full bg-white/20"/>
                <div className="w-2.5 h-2.5 rounded-full bg-white/20"/>
              </div>
              <span className="text-xs text-white/20">Preview</span>
              <div className="w-16"/>
            </div>
            <div className="bg-white p-8">
              <DSLRenderer schema={schema} />
            </div>
          </div>
        )}
        {schema && <CodeExport schema={schema} />}
      </div>
    </main>
  )
}