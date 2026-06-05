import React, { useState, useEffect } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator,
  SafeAreaView, KeyboardAvoidingView, Platform
} from 'react-native'
import { DSLRenderer } from './components/renderer/DSLRenderer'
import AuthScreen from './screens/AuthScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Svg, { Rect, Path } from 'react-native-svg'

const API_URL = 'https://backend-production-b02b.up.railway.app'
const JAVA_API = process.env.EXPO_PUBLIC_JAVA_API_URL || 'https://agentic-ui-engine-production.up.railway.app'

const EXAMPLES = [
  'login form with email and password',
  'user profile card',
  'dashboard with stats',
  'pricing card with features',
]

export default function App() {
  const [prompt, setPrompt] = useState('')
  const [schema, setSchema] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [fromHistory, setFromHistory] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const token = await AsyncStorage.getItem('token')
      const userId = await AsyncStorage.getItem('userId')
      const username = await AsyncStorage.getItem('username')
      const isGuest = await AsyncStorage.getItem('isGuest')
      if (token && userId && username) {
        setUser({ token, userId, username })
      } else if (isGuest) {
        setUser({ guest: true })
      }
    } catch {}
    setAuthChecked(true)
  }

  async function handleLogin(data: any) {
    if (data.guest) {
      await AsyncStorage.setItem('isGuest', 'true')
      setUser({ guest: true })
      return
    }
    await AsyncStorage.setItem('token', data.token)
    await AsyncStorage.setItem('userId', String(data.userId))
    await AsyncStorage.setItem('username', data.username)
    setUser(data)
  }

  async function handleLogout() {
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('userId')
    await AsyncStorage.removeItem('username')
    await AsyncStorage.removeItem('isGuest')
    setUser(null)
    setSchema(null)
    setShowHistory(false)
  }

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()
      setSchema(data.schema)

      if (user?.userId) {
        await fetch(`${JAVA_API}/api/history/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            schema: JSON.stringify(data.schema),
            userId: Number(user.userId),
          }),
        })
      }
    } catch (e) {
      setError('Failed to generate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function loadHistory() {
    if (!user?.userId) return
    const res = await fetch(`${JAVA_API}/api/history/user/${user.userId}`)
    const data = await res.json()
    setHistory(data)
    setShowHistory(true)
  }

  if (!authChecked) return null
  if (!user) return <AuthScreen onLogin={handleLogin} />

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          <View style={styles.header}>
            <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <Rect width="28" height="28" rx="8" fill="#2563eb"/>
              <Path d="M7 21L14 7L21 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M9.5 16.5H18.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </Svg>
            <Text style={styles.title}>Agentic UI Engine</Text>
            <View style={styles.headerRight}>
              {!user.guest && (
                <TouchableOpacity onPress={loadHistory}>
                  <Text style={styles.headerBtn}>History</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.headerBtn}>Sign out</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={prompt}
              onChangeText={setPrompt}
              placeholder="e.g. a login form with email and password"
              placeholderTextColor="#6b7280"
              returnKeyType="send"
              onSubmitEditing={handleGenerate}
            />
          </View>

          <TouchableOpacity style={[styles.generateBtn, loading && styles.generateBtnDisabled]} onPress={handleGenerate} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" size="small"/> : <Text style={styles.generateBtnText}>Generate →</Text>}
          </TouchableOpacity>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.examples}>
            {EXAMPLES.map((example) => (
              <TouchableOpacity key={example} style={styles.exampleChip} onPress={() => setPrompt(example)}>
                <Text style={styles.exampleText}>{example}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {showHistory && (
            <View style={styles.historyBox}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>Generation History</Text>
                <TouchableOpacity onPress={() => { setShowHistory(false); setFromHistory(false); setSchema(null) }}>
                  <Text style={styles.historyClose}>✕</Text>
                </TouchableOpacity>
              </View>
              {history.length > 0 ? history.map((item: any) => (
                <TouchableOpacity key={item.id} style={styles.historyItem} onPress={() => {
                  if (item.schema) { try { setSchema(JSON.parse(item.schema)) } catch {} }
                  setFromHistory(true)
                  setShowHistory(false)
                }}>
                  <Text style={styles.historyPrompt}>{item.prompt}</Text>
                  <Text style={styles.historyDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </TouchableOpacity>
              )) : <Text style={styles.historyEmpty}>No history yet.</Text>}
            </View>
          )}

          {schema && !showHistory && (
            <View style={styles.preview}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewLabel}>PREVIEW</Text>
                <TouchableOpacity onPress={() => {
                  if (fromHistory) { setShowHistory(true); setFromHistory(false) }
                  else { setSchema(null); setPrompt('') }
                }}>
                  <Text style={styles.clearBtn}>✕ Clear</Text>
                </TouchableOpacity>
              </View>
              <DSLRenderer schema={schema} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f0f' },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  logo: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  title: { color: '#fff', fontWeight: '600', fontSize: 16, flex: 1 },
  headerRight: { flexDirection: 'row', gap: 12 },
  headerBtn: { color: '#6b7280', fontSize: 12 },
  inputRow: { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 },
  input: { color: '#fff', fontSize: 14 },
  generateBtn: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  generateBtnDisabled: { opacity: 0.5 },
  generateBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  examples: { marginVertical: 4 },
  exampleChip: { borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  exampleText: { color: '#6b7280', fontSize: 12 },
  error: { color: '#ef4444', fontSize: 13 },
  historyBox: { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 16 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  historyTitle: { color: '#9ca3af', fontSize: 12 },
  historyClose: { color: '#6b7280', fontSize: 14 },
  historyItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#1f1f1f' },
  historyPrompt: { color: '#d1d5db', fontSize: 14 },
  historyDate: { color: '#6b7280', fontSize: 11, marginTop: 4 },
  historyEmpty: { color: '#6b7280', fontSize: 13, padding: 16 },
  preview: { backgroundColor: '#fff', borderRadius: 16, padding: 20, gap: 16 },
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  previewLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '500', letterSpacing: 1 },
  clearBtn: { fontSize: 12, color: '#9ca3af' },
})