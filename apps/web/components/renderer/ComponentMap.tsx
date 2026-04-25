import React from 'react'

export function ButtonComponent({ label, variant, fullWidth }: any) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        variant === 'primary'
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'border border-gray-300 hover:bg-gray-50'
      } ${fullWidth ? 'w-full' : ''}`}
    >
      {label}
    </button>
  )
}

export function InputComponent({ label, placeholder, inputType }: any) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={inputType || 'text'}
        placeholder={placeholder}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export function CardComponent({ title, subtitle }: any) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {title && <p className="font-medium text-gray-900">{title}</p>}
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}

export function ListComponent({ items }: any) {
  return (
    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
      {(items || []).map((item: string, i: number) => (
        <li key={i} className="px-4 py-2 text-sm text-gray-700">{item}</li>
      ))}
    </ul>
  )
}

export function BadgeComponent({ label, variant }: any) {
  const colors: any = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800',
  }
  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${colors[variant] || colors.default}`}>
      {label}
    </span>
  )
}