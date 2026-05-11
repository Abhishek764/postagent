import React, { useState } from 'react'

export default function PostCard({ post, onDelete }) {
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const typeColors = {
    leetcode: 'badge-green',
    project: 'badge-blue',
    opensource: 'badge-purple',
    general: 'badge-amber'
  }

  const typeLabels = {
    leetcode: 'LeetCode Focus',
    project: 'Project Focus',
    opensource: 'Open Source',
    general: 'General Day'
  }

  function getRelativeDate(dateStr) {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 30) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(post.generatedPost)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = post.generatedPost
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleDeleteClick() {
    if (confirmDelete) {
      onDelete?.(post.id)
      setConfirmDelete(false)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <div className="card group animate-fade-in">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold px-2.5 py-1 rounded-lg font-mono">
            Day {post.dayNumber}
          </span>
          <span className={typeColors[post.postType] || 'badge-amber'}>
            {typeLabels[post.postType] || post.postType}
          </span>
        </div>
        <span className="text-xs text-surface-500 whitespace-nowrap">
          {getRelativeDate(post.createdAt)}
        </span>
      </div>

      <p className="text-surface-300 text-sm leading-relaxed mb-4 line-clamp-3">
        {post.generatedPost.length > 150
          ? post.generatedPost.substring(0, 150) + '...'
          : post.generatedPost}
      </p>

      <div className="flex items-center justify-between border-t border-surface-800 pt-3">
        <span className="text-xs text-surface-500">
          {post.characterCount} chars
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 hover:text-surface-100 transition-all duration-200"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDeleteClick}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
              confirmDelete
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-surface-800 hover:bg-surface-700 text-surface-500 hover:text-red-400'
            }`}
          >
            {confirmDelete ? 'Confirm?' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
