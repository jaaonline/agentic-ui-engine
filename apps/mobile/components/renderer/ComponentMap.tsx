import React from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, FlatList
} from 'react-native'

export function ButtonComponent({ label, variant, fullWidth, onPress }: any) {
  const isPrimary = variant === 'primary' || !variant
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        isPrimary ? styles.buttonPrimary : styles.buttonOutline,
        fullWidth && styles.fullWidth
      ]}
    >
      <Text style={[styles.buttonText, !isPrimary && styles.buttonTextOutline]}>
        {label || 'Button'}
      </Text>
    </TouchableOpacity>
  )
}

export function InputComponent({ label, placeholder, inputType, required, value, onChange }: any) {
  return (
    <View style={styles.inputContainer}>
      {label && (
        <Text style={styles.label}>
          {label}{required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value || ''}
        onChangeText={onChange}
        secureTextEntry={inputType === 'password'}
        keyboardType={inputType === 'email' ? 'email-address' : inputType === 'number' ? 'numeric' : 'default'}
        placeholderTextColor="#9ca3af"
      />
    </View>
  )
}

export function CardComponent({ title, subtitle, description, footer }: any) {
  return (
    <View style={styles.card}>
      {title && <Text style={styles.cardTitle}>{title}</Text>}
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
      {description && <Text style={styles.cardDescription}>{description}</Text>}
      {footer && <Text style={styles.cardFooter}>{footer}</Text>}
    </View>
  )
}

export function ListComponent({ items }: any) {
  return (
    <View style={styles.list}>
      {(items || []).map((item: string, i: number) => (
        <View key={i} style={[styles.listItem, i === (items.length - 1) && styles.listItemLast]}>
          <View style={styles.listDot}/>
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  )
}

export function BadgeComponent({ label, variant }: any) {
  const badgeStyles: any = {
    success: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    error: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
    warning: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
    default: { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' },
  }
  const s = badgeStyles[variant] || badgeStyles.default
  return (
    <View style={[styles.badge, { backgroundColor: s.bg, borderColor: s.border }]}>
      <Text style={[styles.badgeText, { color: s.text }]}>{label || 'Badge'}</Text>
    </View>
  )
}

export function HeroComponent({ title, subtitle, ctaLabel }: any) {
  return (
    <View style={styles.hero}>
      {title && <Text style={styles.heroTitle}>{title}</Text>}
      {subtitle && <Text style={styles.heroSubtitle}>{subtitle}</Text>}
      {ctaLabel && (
        <TouchableOpacity style={styles.heroCta}>
          <Text style={styles.heroCtaText}>{ctaLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export function StatComponent({ label, value, change, trend }: any) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {change && (
        <Text style={[styles.statChange, { color: trend === 'up' ? '#16a34a' : '#dc2626' }]}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </Text>
      )}
    </View>
  )
}

export function AvatarComponent({ name, role, initials }: any) {
  return (
    <View style={styles.avatar}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarInitials}>{initials || name?.charAt(0) || '?'}</Text>
      </View>
      <View>
        {name && <Text style={styles.avatarName}>{name}</Text>}
        {role && <Text style={styles.avatarRole}>{role}</Text>}
      </View>
    </View>
  )
}

export function AlertComponent({ message, variant }: any) {
  const alertStyles: any = {
    success: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', icon: '✓' },
    error: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', icon: '✕' },
    warning: { bg: '#fffbeb', text: '#b45309', border: '#fde68a', icon: '⚠' },
    info: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', icon: 'ℹ' },
  }
  const s = alertStyles[variant] || alertStyles.info
  return (
    <View style={[styles.alert, { backgroundColor: s.bg, borderColor: s.border }]}>
      <Text style={[styles.alertIcon, { color: s.text }]}>{s.icon}</Text>
      <Text style={[styles.alertText, { color: s.text }]}>{message}</Text>
    </View>
  )
}

export function DividerComponent({ label }: any) {
  return (
    <View style={styles.divider}>
      <View style={styles.dividerLine}/>
      {label && <Text style={styles.dividerLabel}>{label}</Text>}
      <View style={styles.dividerLine}/>
    </View>
  )
}

const styles = StyleSheet.create({
  button: { borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#2563eb' },
  buttonOutline: { borderWidth: 1, borderColor: '#d1d5db' },
  fullWidth: { width: '100%' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  buttonTextOutline: { color: '#374151' },
  inputContainer: { gap: 6 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151' },
  required: { color: '#ef4444' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#111827' },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, backgroundColor: '#fff' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  cardSubtitle: { fontSize: 13, color: '#2563eb', fontWeight: '500', marginTop: 2 },
  cardDescription: { fontSize: 13, color: '#6b7280', marginTop: 6, lineHeight: 20 },
  cardFooter: { fontSize: 12, color: '#9ca3af', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  list: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff' },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', gap: 10 },
  listItemLast: { borderBottomWidth: 0 },
  listDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#60a5fa' },
  listText: { fontSize: 14, color: '#374151' },
  badge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  badgeText: { fontSize: 12, fontWeight: '500' },
  hero: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 16 },
  heroTitle: { fontSize: 28, fontWeight: '700', color: '#111827', textAlign: 'center' },
  heroSubtitle: { fontSize: 15, color: '#6b7280', marginTop: 10, textAlign: 'center', lineHeight: 22 },
  heroCta: { marginTop: 20, backgroundColor: '#2563eb', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  heroCtaText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  stat: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, backgroundColor: '#fff' },
  statLabel: { fontSize: 11, color: '#6b7280', fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 22, fontWeight: '700', color: '#111827', marginTop: 4 },
  statChange: { fontSize: 12, fontWeight: '500', marginTop: 4 },
  avatar: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8 },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { fontSize: 14, fontWeight: '600', color: '#2563eb' },
  avatarName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  avatarRole: { fontSize: 12, color: '#6b7280' },
  alert: { flexDirection: 'row', alignItems: 'flex-start', padding: 12, borderRadius: 8, borderWidth: 1, gap: 8 },
  alertIcon: { fontWeight: '700', fontSize: 14 },
  alertText: { fontSize: 13, flex: 1 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  dividerLabel: { fontSize: 12, color: '#9ca3af' },
})