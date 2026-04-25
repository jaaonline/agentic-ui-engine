'use client'

import { useState } from 'react'

function schemaToCode(schema: any): string {
  if (!schema) return ''

  const components = schema.components.map((comp: any) => {
    const props = comp.props || {}

    switch (comp.type) {
      case 'button':
        return `<button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500">
  ${props.label || 'Button'}
</button>`
      case 'input':
        return `<div className="flex flex-col gap-1.5">
  ${props.label ? `<label className="text-sm font-medium text-gray-700">${props.label}</label>` : ''}
  <input
    type="${props.inputType || 'text'}"
    placeholder="${props.placeholder || ''}"
    className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
  />
</div>`
      case 'card':
        return `<div className="border border-gray-200 rounded-xl p-5 shadow-sm">
  ${props.title ? `<h3 className="font-semibold text-gray-900">${props.title}</h3>` : ''}
  ${props.subtitle ? `<p className="text-sm text-blue-600 mt-0.5">${props.subtitle}</p>` : ''}
  ${props.description ? `<p className="text-sm text-gray-500 mt-2">${props.description}</p>` : ''}
</div>`
      case 'list':
        return `<ul className="rounded-xl border border-gray-200 overflow-hidden">
  ${(props.items || []).map((item: string) => `<li className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100 last:border-0">${item}</li>`).join('\n  ')}
</ul>`
      case 'badge':
        return `<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
  ${props.label || 'Badge'}
</span>`
      case 'hero':
        return `<div className="text-center py-8">
  ${props.title ? `<h1 className="text-3xl font-bold text-gray-900">${props.title}</h1>` : ''}
  ${props.subtitle ? `<p className="text-base text-gray-500 mt-3">${props.subtitle}</p>` : ''}
  ${props.ctaLabel ? `<button className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium">${props.ctaLabel}</button>` : ''}
</div>`
      case 'stat':
        return `<div className="border border-gray-200 rounded-xl p-4">
  <p className="text-xs text-gray-500 uppercase tracking-wide">${props.label || ''}</p>
  <p className="text-2xl font-bold text-gray-900 mt-1">${props.value || ''}</p>
</div>`
      case 'avatar':
        return `<div className="flex items-center gap-3 p-3">
  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
    ${props.initials || props.name?.charAt(0) || '?'}
  </div>
  <div>
    ${props.name ? `<p className="text-sm font-semibold text-gray-900">${props.name}</p>` : ''}
    ${props.role ? `<p className="text-xs text-gray-500">${props.role}</p>` : ''}
  </div>
</div>`
      case 'divider':
        return `<div className="flex items-center gap-3 py-1">
  <div className="flex-1 h-px bg-gray-200"/>
  ${props.label ? `<span className="text-xs text-gray-400">${props.label}</span>` : ''}
  <div className="flex-1 h-px bg-gray-200"/>
</div>`
      default:
        return `<div />`
    }
  }).join('\n\n')

  return `export default function GeneratedComponent() {
  return (
    <div className="flex flex-col gap-4">
      ${components.split('\n').join('\n      ')}
    </div>
  )
}`
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