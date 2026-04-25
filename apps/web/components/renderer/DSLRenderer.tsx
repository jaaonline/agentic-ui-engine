'use client'

import React, { useState } from 'react'
import {
  ButtonComponent, InputComponent, CardComponent,
  ListComponent, BadgeComponent, HeroComponent,
  StatComponent, AvatarComponent, DividerComponent,
  TableComponent, NavbarComponent, AlertComponent, ProgressComponent
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
  divider: DividerComponent,
  table: TableComponent,
  navbar: NavbarComponent,
  alert: AlertComponent,
  progress: ProgressComponent,
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
  const [hidden, setHidden] = useState<Record<string, boolean>>({})

  if (!schema) return null

  const interactions: any[] = schema.interactions || []

  function handleAction(sourceId: string) {
    const interaction = interactions.find((i: any) => i.sourceId === sourceId)
    if (!interaction) return

    const { action, targetId, successMessage, errorMessage } = interaction

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

    if (action === 'toggle' && targetId) {
      setHidden(prev => ({ ...prev, [targetId]: !prev[targetId] }))
    }

    if (action === 'reset') {
      setInputValues({})
      setErrors({})
      setSuccess({})
    }
  }

  const groups = groupComponents(schema.components)

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group, i) => {
        if (group.type === 'stat-group') {
          return (
            <div key={`stat-group-${i}`} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {group.items.map((comp: any, j: number) => (
                <StatComponent key={`stat-${i}-${j}`} {...comp.props} />
              ))}
            </div>
          )
        }

        if (hidden[group.id]) return null

        const Component = componentMap[group.type]
        if (!Component) return null

        if (!group.props || typeof group.props !== 'object') return null

        if (group.type === 'input') {
          const inputKey = `input-${group.originalIndex}`
          return (
            <div key={`input-${i}`}>
              <Component
                {...group.props}
                value={inputValues[inputKey] || ''}
                onChange={(e: any) => {
                  setInputValues(prev => ({ ...prev, [inputKey]: e.target.value }))
                  setErrors(prev => ({ ...prev, [group.id]: '' }))
                }}
              />
              {errors[group.id] && (
                <p className="text-xs text-red-500 mt-1">{errors[group.id]}</p>
              )}
            </div>
          )
        }

        if (group.type === 'button') {
          const hasInteraction = interactions.some((i: any) => i.sourceId === group.id)
          return (
            <div key={`button-${i}`}>
              <Component
                {...group.props}
                onClick={hasInteraction ? () => handleAction(group.id) : undefined}
              />
              {success[group.id] && (
                <div className="mt-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium">
                  ✓ {success[group.id]}
                </div>
              )}
            </div>
          )
        }

        return <Component key={`comp-${i}`} {...group.props} />
      })}
    </div>
  )
}