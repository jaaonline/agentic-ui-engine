import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform
} from 'react-native'

const JAVA_API = process.env.EXPO_PUBLIC_JAVA_API_URL || 'http://localhost:8080'

export default function AuthScreen({ onLogin }: { onLogin: (data: any) => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  console.log('JAVA_API:', JAVA_API)

  async function handleSubmit() {
    if (!email || !password) return
    setLoading(true)
    setError('')

    if (!isLogin) {
      if (password.length < 8) { setError('Password must be at least 8 characters'); setLoading(false); return }
      if (!/[A-Z]/.test(password)) { setError('Password must contain at least one uppercase letter'); setLoading(false); return }
      if (!/[a-z]/.test(password)) { setError('Password must contain at least one lowercase letter'); setLoading(false); return }
      if (!/[0-9]/.test(password)) { setError('Password must contain at least one number'); setLoading(false); return }
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
      onLogin(data)
    } catch (e: any) {
      console.log('Auth error:', e.message, e)
      setError(isLogin ? 'Invalid email or password.' : 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.container}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.title}>{isLogin ? 'Welcome back' : 'Create account'}</Text>
          <Text style={styles.subtitle}>{isLogin ? 'Sign in to your account' : 'Start generating UI components'}</Text>

          {!isLogin && (
            <View style={styles.field}>
              <Text style={styles.label}>Username</Text>
              <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="johndoe" placeholderTextColor="#4b5563"/>
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#4b5563" keyboardType="email-address" autoCapitalize="none"/>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor="#4b5563" secureTextEntry/>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.btnText}>{loading ? 'Loading...' : isLogin ? 'Sign in' : 'Create account'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setIsLogin(!isLogin); setError('') }}>
            <Text style={styles.switch}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.switchLink}>{isLogin ? 'Sign up' : 'Sign in'}</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onLogin({ guest: true })}>
            <Text style={styles.guest}>Continue as guest</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f0f' },
  flex: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  logo: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
  logoText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  title: { fontSize: 24, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 32 },
  field: { marginBottom: 16 },
  label: { fontSize: 12, color: '#9ca3af', marginBottom: 6 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#fff' },
  error: { color: '#f87171', fontSize: 12, marginBottom: 12 },
  btn: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  switch: { textAlign: 'center', color: '#6b7280', fontSize: 13, marginBottom: 12 },
  switchLink: { color: '#60a5fa' },
  guest: { textAlign: 'center', color: '#374151', fontSize: 13 },
})