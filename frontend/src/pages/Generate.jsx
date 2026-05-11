import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/auth.store.js'
import client from '../api/client.js'
import StatusDot from '../components/StatusDot.jsx'

const POST_TYPES = [
  { value: 'leetcode', label: 'LeetCode Focus' },
  { value: 'project', label: 'Project Focus' },
  { value: 'opensource', label: 'Open Source Focus' },
  { value: 'general', label: 'General Day' }
]

const LOADING_MESSAGES = [
  'Fetching your GitHub commits...',
  'Reading your LeetCode stats...',
  'Claude is writing your post...'
]

export default function Generate() {
  const { user, updateUser } = useAuthStore()
  const [dayNumber, setDayNumber] = useState(user?.currentDay || 1)
  const [postType, setPostType] = useState('general')
  const [story, setStory] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const msgIndex = useRef(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (loading) {
      msgIndex.current = 0
      setLoadingMsg(LOADING_MESSAGES[0])
      intervalRef.current = setInterval(() => {
        msgIndex.current = (msgIndex.current + 1) % LOADING_MESSAGES.length
        setLoadingMsg(LOADING_MESSAGES[msgIndex.current])
      }, 2000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [loading])

  async function handleGenerate() {
    if (story.length < 20) return
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const { data } = await client.post('/generate', { story, postType, dayNumber })
      setResult(data)
      updateUser({ currentDay: (user?.currentDay || 1) + 1 })
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!result?.post) return
    try {
      await navigator.clipboard.writeText(result.post)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = result.post
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleRegenerate() {
    setResult(null)
    handleGenerate()
  }

  const charCountColor = result && result.characterCount > 2000 ? 'text-yellow-400' : 'text-emerald-400'

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-surface-50 font-mono">Generate Post</h1>
        <p className="text-surface-500 mt-1">Tell us about your day and we'll craft the perfect LinkedIn post.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left — Inputs */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="gen-day" className="block text-sm font-medium text-surface-300 mb-1.5">Day Number</label>
              <input id="gen-day" type="number" min="1" value={dayNumber} onChange={e => setDayNumber(parseInt(e.target.value) || 1)} className="input-field font-mono" />
            </div>
            <div>
              <label htmlFor="gen-type" className="block text-sm font-medium text-surface-300 mb-1.5">Post Type</label>
              <select id="gen-type" value={postType} onChange={e => setPostType(e.target.value)} className="input-field">
                {POST_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="gen-story" className="block text-sm font-medium text-surface-300 mb-1.5">Tell me about today</label>
            <textarea
              id="gen-story"
              value={story}
              onChange={e => setStory(e.target.value)}
              placeholder="What did you build? What broke? What clicked? Write it like you're texting a friend. 2-10 sentences is perfect."
              rows={7}
              maxLength={1000}
              className="input-field resize-none min-h-[160px]"
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${story.length > 900 ? 'text-yellow-400' : 'text-surface-500'}`}>
                {story.length} / 1000
              </span>
            </div>
          </div>

          {/* Integration status */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-surface-900 border border-surface-800 rounded-lg px-3 py-2">
              <StatusDot status={user?.githubUsername ? 'connected' : 'disconnected'} label="GitHub" />
              {!user?.githubUsername && <Link to="/settings" className="text-xs text-brand-400 hover:text-brand-300">Add in Settings</Link>}
            </div>
            <div className="flex items-center gap-2 bg-surface-900 border border-surface-800 rounded-lg px-3 py-2">
              <StatusDot status={user?.leetcodeUsername ? 'connected' : 'disconnected'} label="LeetCode" />
              {!user?.leetcodeUsername && <Link to="/settings" className="text-xs text-brand-400 hover:text-brand-300">Add in Settings</Link>}
            </div>
          </div>

          <button onClick={handleGenerate} disabled={story.length < 20 || loading} className="btn-primary w-full glow-sm">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                Generating...
              </span>
            ) : 'Generate Post →'}
          </button>
        </div>

        {/* Right — Output */}
        <div>
          {!loading && !result && !error && (
            <div className="border-2 border-dashed border-surface-700 rounded-xl p-12 flex items-center justify-center min-h-[400px]">
              <p className="text-surface-500 text-center">Your LinkedIn post will appear here</p>
            </div>
          )}

          {loading && (
            <div className="card min-h-[400px] flex flex-col items-center justify-center gap-4">
              <div className="space-y-3 w-full">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-5/6 rounded" />
                <div className="skeleton h-4 w-4/6 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
              </div>
              <p className="text-sm text-brand-400 animate-pulse mt-4">{loadingMsg}</p>
            </div>
          )}

          {error && !loading && (
            <div className="card min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-400 mb-3">{error}</p>
                <button onClick={() => { setError(''); handleGenerate() }} className="btn-secondary text-sm">Try Again</button>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-surface-300">Generated Post</span>
                <span className={`text-xs font-mono ${charCountColor}`}>{result.characterCount} chars</span>
              </div>

              <div className="bg-surface-950 border border-surface-800 rounded-lg p-4">
                <p className="text-surface-200 text-sm leading-relaxed whitespace-pre-line">{result.post}</p>
              </div>

              {/* Data chips */}
              <div className="flex flex-wrap gap-2">
                {result.githubData ? (
                  <span className="badge-green">{result.githubData.commits?.length || 0} GitHub commits</span>
                ) : (
                  <span className="badge-red">GitHub unavailable</span>
                )}
                {result.leetcodeData ? (
                  <span className="badge-green">{result.leetcodeData.recentSolved?.length || 0} LeetCode problems</span>
                ) : (
                  <span className="badge-red">LeetCode unavailable</span>
                )}
                <span className="badge-amber">Your story</span>
              </div>

              <div className="flex gap-3">
                <button onClick={handleCopy} className="btn-primary flex-1">
                  {copied ? '✓ Copied!' : 'Copy Post'}
                </button>
                <button onClick={handleRegenerate} className="btn-secondary flex-1">Regenerate</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
