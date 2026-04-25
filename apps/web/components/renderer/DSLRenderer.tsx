import React from 'react'
import { ButtonComponent, InputComponent, CardComponent, ListComponent, BadgeComponent } from './ComponentMap'

const componentMap: any = {
  button: ButtonComponent,
  input: InputComponent,
  card: CardComponent,
  list: ListComponent,
  badge: BadgeComponent,
}

export function DSLRenderer({ schema }: { schema: any }) {
  if (!schema) return null

  return (
    <div className="flex flex-col gap-4">
      {schema.components.map((comp: any) => {
        const Component = componentMap[comp.type]
        if (!Component) return null
        return <Component key={comp.id} {...comp.props} />
      })}
    </div>
  )
}