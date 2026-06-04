'use client'

import { useState } from 'react'

const JAVA_API = process.env.NEXT_PUBLIC_JAVA_API_URL || 'http://localhost:8080'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email || !password) return
    setLoading(true)
    setError('')

    if (!isLogin) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters')
        setLoading(false)
        return
      }
      if (!/[A-Z]/.test(password)) {
        setError('Password must contain at least one uppercase letter')
        setLoading(false)
        return
      }
      if (!/[a-z]/.test(password)) {
        setError('Password must contain at least one lowercase letter')
        setLoading(false)
        return
      }
      if (!/[0-9]/.test(password)) {
        setError('Password must contain at least one number')
        setLoading(false)
        return
      }
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const body: any = { email, password }
      if (!isLogin) body.username = username

      const res = await fetch(`${JAVA_API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Authentication failed')

      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', String(data.userId))
      localStorage.setItem('username', data.username)
      window.location.href = '/'
    } catch (e) {
      setError(isLogin ? 'Invalid email or password.' : 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
      <div className="w-full max-w-sm px-8">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="8" fill="#2563eb"/>
            <path d="M7 21L14 7L21 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 16.5H18.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>      
          <span className="font-semibold text-sm tracking-tight">Agentic UI Engine</span>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">
          {isLogin ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-white/40 text-sm text-center mb-8">
          {isLogin ? 'Sign in to your account' : 'Start generating UI components'}
        </p>

        <div className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/50">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/50">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/50">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-medium py-3 rounded-xl transition-colors mt-2"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </div>

        <p className="text-center text-white/30 text-sm mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError('') }}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
        <button
          onClick={() => {
            localStorage.setItem('isGuest', 'true')
            window.location.href = '/'
          }}
          className="w-full text-center text-white/20 hover:text-white/40 text-sm mt-3 transition-colors"
        >
          Continue as guest
        </button>
      </div>
    </main>
  )
}
