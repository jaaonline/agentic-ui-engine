import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator,
  SafeAreaView, KeyboardAvoidingView, Platform
} from 'react-native'
import { DSLRenderer } from './components/renderer/DSLRenderer'

const API_URL = 'https://backend-production-b02b.up.railway.app'

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
    } catch (e) {
      setError('Failed to generate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>A</Text>
            </View>
            <Text style={styles.title}>Agentic UI Engine</Text>
          </View>

          <Text style={styles.subtitle}>Describe a UI component in natural language</Text>

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={prompt}
              onChangeText={setPrompt}
              placeholder="e.g. a login form with email and password"
              placeholderTextColor="#6b7280"
              multiline={false}
              returnKeyType="send"
              onSubmitEditing={handleGenerate}
            />
          </View>

          <TouchableOpacity
            style={[styles.generateBtn, loading && styles.generateBtnDisabled]}
            onPress={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small"/>
            ) : (
              <Text style={styles.generateBtnText}>Generate →</Text>
            )}
          </TouchableOpacity>

          {/* Example prompts */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.examples}>
            {EXAMPLES.map((example) => (
              <TouchableOpacity
                key={example}
                style={styles.exampleChip}
                onPress={() => setPrompt(example)}
              >
                <Text style={styles.exampleText}>{example}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Preview */}
          {schema && (
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>PREVIEW</Text>
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
  title: { color: '#fff', fontWeight: '600', fontSize: 16 },
  subtitle: { color: '#6b7280', fontSize: 13 },
  inputRow: { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 },
  input: { color: '#fff', fontSize: 14 },
  generateBtn: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  generateBtnDisabled: { opacity: 0.5 },
  generateBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  examples: { marginVertical: 4 },
  exampleChip: { borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  exampleText: { color: '#6b7280', fontSize: 12 },
  error: { color: '#ef4444', fontSize: 13 },
  preview: { backgroundColor: '#fff', borderRadius: 16, padding: 20, gap: 16 },
  previewLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '500', letterSpacing: 1 },
})
