'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { generateUI } from '@/lib/api'
import { DSLRenderer } from '@/components/renderer/DSLRenderer'
import { CodeExport } from '@/components/renderer/CodeExport'

const JAVA_API = process.env.NEXT_PUBLIC_JAVA_API_URL || 'http://localhost:8080'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [schema, setSchema] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [username, setUsername] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [fromHistory, setFromHistory] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username')
      const isGuest = localStorage.getItem('isGuest')
      if (!storedUsername && !isGuest) {
        window.location.href = '/auth'
        return
      }
      setUsername(storedUsername || 'Guest')
      setMounted(true)
    }
  }, [])

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    try {
      const userId = localStorage.getItem('userId')
      const result = await generateUI(prompt, userId ? Number(userId) : undefined)
      setSchema(result)

      if (userId) {
        await fetch(`${JAVA_API}/api/history/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            schema: JSON.stringify(result),
            userId: Number(userId),
          }),
        })
      }
    } catch (e) {
      setError('Failed to generate UI. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function loadHistory() {
    const userId = localStorage.getItem('userId')
    if (!userId) return
    const res = await fetch(`${JAVA_API}/api/history/user/${userId}`)
    const data = await res.json()
    setHistory(data)
    setShowHistory(true)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('isGuest')
    setUsername(null)
    setShowHistory(false)
    window.location.href = '/auth'
  }

  if (!mounted) return null
  
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="8" fill="#2563eb"/>
            <path d="M7 21L14 7L21 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 16.5H18.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>        
        </div>
        <div className="flex items-center gap-4">
          {username ? (
            <>
            {!localStorage.getItem('isGuest') && (
              <button
                onClick={loadHistory}
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                History
              </button>
            )}
              <span className="text-xs text-white/40">{username}</span>
              <button
                onClick={handleLogout}
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push('/auth')}
              className="text-xs bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            Describe UI,<br />watch it appear.
          </h1>
          <p className="text-white/40 text-lg">
            Natural language to interactive components, instantly.
          </p>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. a signup form with name, email, and a submit button"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all pr-32"
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

        {showHistory && history.length > 0 && (
          <div className="border border-white/10 rounded-2xl overflow-hidden mb-8">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <span className="text-xs text-white/40">Generation History</span>
                <button 
                  onClick={() => { 
                    setShowHistory(false)
                    setFromHistory(false)
                    setSchema(null)
                    setPrompt('')
                  }} 
                  className="text-xs text-white/30 hover:text-white/60"
                >✕</button>            
             </div>
            <div className="divide-y divide-white/5">
              {history.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.schema) {
                      try { setSchema(JSON.parse(item.schema)) } catch {}
                    }
                    setFromHistory(true)
                    setShowHistory(false)
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-white/5 transition-colors"
                >
                  <p className="text-sm text-white/70">{item.prompt}</p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {schema && !showHistory && (
          <div className="border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20"/>
                <div className="w-2.5 h-2.5 rounded-full bg-white/20"/>
                <div className="w-2.5 h-2.5 rounded-full bg-white/20"/>
              </div>
              <span className="text-xs text-white/20">Preview</span>
              <button
                onClick={() => {
                  if (fromHistory) {
                    setShowHistory(true)
                    setFromHistory(false)
                  } else {
                    setSchema(null)
                    setPrompt('')
                  }
                }}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                ✕ Clear
              </button>
            </div>
            <div className="bg-white p-8">
              <DSLRenderer schema={schema} prompt={prompt} />
            </div>
          </div>
        )}

        {schema && !showHistory && <CodeExport schema={schema} />}
      </div>
    </main>
  )
}