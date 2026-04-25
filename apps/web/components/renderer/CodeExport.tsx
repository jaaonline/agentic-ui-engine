'use client'

import { useState } from 'react'

function schemaToCode(schema: any): string {
  if (!schema) return ''

  const components = schema.components.map((comp: any) => {
    const props = Object.entries(comp.props || {})
      .map(([key, value]) => `  ${key}="${value}"`)
      .join('\n')

    switch (comp.type) {
      case 'button':
        return `<button className="px-4 py-2 bg-blue-600 text-white rounded-md">\n  ${comp.props.label || 'Button'}\n</button>`
      case 'input':
        return `<input\n  type="${comp.props.inputType || 'text'}"\n  placeholder="${comp.props.placeholder || ''}"\n  className="border rounded-md px-3 py-2 w-full"\n/>`
      case 'card':
        return `<div className="border rounded-lg p-4">\n  <h3>${comp.props.title || 'Card'}</h3>\n  <p>${comp.props.subtitle || ''}</p>\n</div>`
      case 'list':
        return `<ul className="divide-y border rounded-md">\n  {items.map(item => <li key={item}>{item}</li>)}\n</ul>`
      case 'badge':
        return `<span className="px-2 py-1 bg-gray-100 rounded text-sm">\n  ${comp.props.label || 'Badge'}\n</span>`
      default:
        return `<div />`
    }
  }).join('\n\n')

  return `export default function GeneratedComponent() {\n  return (\n    <div className="flex flex-col gap-4">\n      ${components.split('\n').join('\n      ')}\n    </div>\n  )\n}`
}

export function CodeExport({ schema }: { schema: any }) {
  const [copied, setCopied] = useState(false)
  const code = schemaToCode(schema)

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden mt-4">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/3">
        <span className="text-xs text-white/40">Generated Code</span>
        <button
          onClick={handleCopy}
          className="text-xs text-white/40 hover:text-white/80 border border-white/10 hover:border-white/20 px-3 py-1 rounded-md transition-all"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-[#0a0a0a] p-5 text-xs text-green-400/80 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}