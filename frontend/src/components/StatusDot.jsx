import React from 'react'

export default function StatusDot({ status = 'disconnected', label = '' }) {
  const dotStyles = {
    connected: 'bg-emerald-400 shadow-emerald-400/50',
    disconnected: 'bg-red-400 shadow-red-400/50',
    loading: 'bg-brand-400 shadow-brand-400/50 animate-pulse'
  }

  const textStyles = {
    connected: 'text-emerald-400',
    disconnected: 'text-red-400',
    loading: 'text-brand-400'
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full shadow-sm ${dotStyles[status] || dotStyles.disconnected}`}
      />
      {label && (
        <span className={`text-xs font-medium ${textStyles[status] || textStyles.disconnected}`}>
          {label}
        </span>
      )}
    </span>
  )
}
