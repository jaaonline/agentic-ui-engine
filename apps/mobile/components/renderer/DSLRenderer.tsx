import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import {
  ButtonComponent, InputComponent, CardComponent,
  ListComponent, BadgeComponent, HeroComponent,
  StatComponent, AvatarComponent, AlertComponent, DividerComponent
} from './ComponentMap'

const componentMap: any = {
  button: ButtonComponent,
  input: InputComponent,
  card: CardComponent,
  list: ListComponent,
  badge: BadgeComponent,
  hero: HeroComponent,
  stat: StatComponent,
  avatar: AvatarComponent,
  alert: AlertComponent,
  divider: DividerComponent,
}

function groupComponents(components: any[]) {
  const groups: any[] = []
  let statGroup: any[] = []

  components.forEach((comp, originalIndex) => {
    if (comp.type === 'stat') {
      statGroup.push({ ...comp, originalIndex })
    } else {
      if (statGroup.length > 0) {
        groups.push({ type: 'stat-group', items: statGroup })
        statGroup = []
      }
      groups.push({ ...comp, originalIndex })
    }
  })

  if (statGroup.length > 0) {
    groups.push({ type: 'stat-group', items: statGroup })
  }

  return groups
}

export function DSLRenderer({ schema }: { schema: any }) {
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<Record<string, string>>({})

  if (!schema) return null

  const interactions: any[] = schema.interactions || []

  function handleAction(sourceId: string) {
    const interaction = interactions.find((i: any) => i.sourceId === sourceId)
    if (!interaction) return

    const { action, successMessage, errorMessage } = interaction

    if (action === 'validate' || action === 'submit') {
      const requiredInputs = schema.components
        .map((c: any, idx: number) => ({ ...c, index: idx }))
        .filter((c: any) => c.type === 'input' && c.props?.required)

      const hasErrors = requiredInputs.some(
        (c: any) => !inputValues[`input-${c.index}`] || inputValues[`input-${c.index}`].trim() === ''
      )

      if (hasErrors) {
        const newErrors: Record<string, string> = {}
        requiredInputs.forEach((c: any) => {
          if (!inputValues[`input-${c.index}`] || inputValues[`input-${c.index}`].trim() === '') {
            newErrors[c.id] = errorMessage || 'This field is required'
          }
        })
        setErrors(newErrors)
        return
      }

      if (action === 'submit') {
        setErrors({})
        setSuccess({ [sourceId]: successMessage || 'Submitted successfully!' })
        setTimeout(() => setSuccess({}), 3000)
      }
    }

    if (action === 'reset') {
      setInputValues({})
      setErrors({})
      setSuccess({})
    }
  }

  const groups = groupComponents(schema.components)

  return (
    <View style={styles.container}>
      {groups.map((group, i) => {
        if (group.type === 'stat-group') {
          return (
            <View key={`stat-group-${i}`} style={styles.statGrid}>
              {group.items.map((comp: any, j: number) => (
                <View key={`stat-${i}-${j}`} style={styles.statItem}>
                  <StatComponent {...comp.props} />
                </View>
              ))}
            </View>
          )
        }

        const Component = componentMap[group.type]
        if (!Component || !group.props) return null

        if (group.type === 'input') {
          const inputKey = `input-${group.originalIndex}`
          return (
            <View key={`input-${i}`}>
              <Component
                {...group.props}
                value={inputValues[inputKey] || ''}
                onChange={(text: string) => {
                  setInputValues(prev => ({ ...prev, [inputKey]: text }))
                  setErrors(prev => ({ ...prev, [group.id]: '' }))
                }}
              />
              {errors[group.id] && (
                <Text style={styles.error}>{errors[group.id]}</Text>
              )}
            </View>
          )
        }

        if (group.type === 'button') {
          const hasInteraction = interactions.some((i: any) => i.sourceId === group.id)
          return (
            <View key={`button-${i}`}>
              <Component
                {...group.props}
                onPress={hasInteraction ? () => handleAction(group.id) : undefined}
              />
              {success[group.id] && (
                <View style={styles.successBox}>
                  <Text style={styles.successText}>✓ {success[group.id]}</Text>
                </View>
              )}
            </View>
          )
        }

        return <Component key={`comp-${i}`} {...group.props} />
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statItem: { flex: 1, minWidth: '45%' },
  error: { fontSize: 12, color: '#ef4444', marginTop: 4 },
  successBox: { marginTop: 8, padding: 12, backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 8 },
  successText: { fontSize: 13, color: '#15803d', fontWeight: '500' },
})