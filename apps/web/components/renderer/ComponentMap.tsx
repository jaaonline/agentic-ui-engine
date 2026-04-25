import React from 'react'

export function ButtonComponent({ label, variant, fullWidth, onClick }: any) {
  const base = `px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${fullWidth ? 'w-full' : ''}`
  const styles: any = {
    primary: `${base} bg-blue-600 text-white hover:bg-blue-500 active:scale-95`,
    outline: `${base} border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95`,
    ghost: `${base} text-gray-600 hover:bg-gray-100 active:scale-95`,
  }
  return (
    <button onClick={onClick} className={styles[variant] || styles.primary}>
      {label || 'Button'}
    </button>
  )
}

export function InputComponent({ label, placeholder, inputType, required, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={inputType || 'text'}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
      />
    </div>
  )
}

export function CardComponent({ title, subtitle, description, footer }: any) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
      {title && <h3 className="font-semibold text-gray-900 text-base">{title}</h3>}
      {subtitle && <p className="text-sm text-blue-600 font-medium mt-0.5">{subtitle}</p>}
      {description && <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>}
      {footer && <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">{footer}</p>}
    </div>
  )
}

export function ListComponent({ items }: any) {
  return (
    <ul className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      {(items || []).map((item: string, i: number) => (
        <li key={i} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"/>
          {item}
        </li>
      ))}
    </ul>
  )
}

export function BadgeComponent({ label, variant }: any) {
  const styles: any = {
    success: 'bg-green-50 text-green-700 border border-green-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    default: 'bg-gray-100 text-gray-600 border border-gray-200',
  }
  return <span className={`inline-flex items-center w-fit px-2.5 py-1 rounded-full text-xs font-medium ${styles[variant] || styles.default}`}>{label || 'Badge'}</span>
}

export function HeroComponent({ title, subtitle, ctaLabel }: any) {
  return (
    <div className="text-center py-8 px-4">
      {title && <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>}
      {subtitle && <p className="text-base text-gray-500 mt-3 max-w-md mx-auto leading-relaxed">{subtitle}</p>}
      {ctaLabel && (
        <button className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors">
          {ctaLabel}
        </button>
      )}
    </div>
  )
}

export function StatComponent({ label, value, change, trend }: any) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {change && (
        <p className={`text-xs font-medium mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </p>
      )}
    </div>
  )
}

export function AvatarComponent({ name, role, initials }: any) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600 flex-shrink-0">
        {initials || name?.charAt(0) || '?'}
      </div>
      <div>
        {name && <p className="text-sm font-semibold text-gray-900">{name}</p>}
        {role && <p className="text-xs text-gray-500">{role}</p>}
      </div>
    </div>
  )
}

export function DividerComponent({ label }: any) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-gray-200"/>
      {label && <span className="text-xs text-gray-400 font-medium">{label}</span>}
      <div className="flex-1 h-px bg-gray-200"/>
    </div>
  )
}