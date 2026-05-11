import React, { useState } from 'react'
import useAuthStore from '../store/auth.store.js'
import client from '../api/client.js'
import StatusDot from '../components/StatusDot.jsx'

export default function Settings() {
  const { user, updateUser } = useAuthStore()
  const [name, setName] = useState(user?.name || '')
  const [github, setGithub] = useState(user?.githubUsername || '')
  const [leetcode, setLeetcode] = useState(user?.leetcodeUsername || '')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [integrationSaving, setIntegrationSaving] = useState(false)
  const [integrationMsg, setIntegrationMsg] = useState('')
  const [githubTest, setGithubTest] = useState({ status: 'idle', message: '' })
  const [leetcodeTest, setLeetcodeTest] = useState({ status: 'idle', message: '' })

  async function handleSaveProfile(e) {
    e.preventDefault()
    setProfileSaving(true)
    setProfileMsg('')
    try {
      const { data } = await client.patch('/user/profile', { name })
      updateUser(data.user)
      setProfileMsg('Profile saved!')
      setTimeout(() => setProfileMsg(''), 3000)
    } catch (err) {
      setProfileMsg(err.response?.data?.error || 'Failed to save')
    } finally {
      setProfileSaving(false)
    }
  }

  async function handleSaveIntegrations(e) {
    e.preventDefault()
    setIntegrationSaving(true)
    setIntegrationMsg('')
    try {
      const payload = {}
      if (github) payload.githubUsername = github
      if (leetcode) payload.leetcodeUsername = leetcode
      const { data } = await client.patch('/user/profile', payload)
      updateUser(data.user)
      setIntegrationMsg('Integrations saved!')
      setTimeout(() => setIntegrationMsg(''), 3000)
    } catch (err) {
      setIntegrationMsg(err.response?.data?.error || 'Failed to save')
    } finally {
      setIntegrationSaving(false)
    }
  }

  async function testGitHub() {
    if (!github) return
    setGithubTest({ status: 'loading', message: 'Testing...' })
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(github)}/events?per_page=5`, { headers: { 'User-Agent': 'PostAgent/1.0' } })
      if (!res.ok) throw new Error('Not found')
      const events = await res.json()
      const commits = events.filter(e => e.type === 'PushEvent').reduce((acc, e) => acc + (e.payload?.commits?.length || 0), 0)
      setGithubTest({ status: 'success', message: `Found ${commits} recent commits` })
    } catch {
      setGithubTest({ status: 'error', message: 'Username not found' })
    }
  }

  async function testLeetCode() {
    if (!leetcode) return
    setLeetcodeTest({ status: 'loading', message: 'Testing...' })
    try {
      const res = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${encodeURIComponent(leetcode)}`)
      if (!res.ok) throw new Error('Not found')
      const data = await res.json()
      if (!data.totalSolved && data.totalSolved !== 0) throw new Error('Invalid')
      setLeetcodeTest({ status: 'success', message: `Found ${data.totalSolved} problems solved` })
    } catch {
      setLeetcodeTest({ status: 'error', message: 'Username not found' })
    }
  }

  return (
    <div className="page-container animate-fade-in max-w-2xl">
      <h1 className="text-3xl font-bold text-surface-50 font-mono mb-8">Settings</h1>

      {/* Profile */}
      <form onSubmit={handleSaveProfile} className="card mb-6">
        <h2 className="text-lg font-bold text-surface-100 mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="settings-name" className="block text-sm font-medium text-surface-300 mb-1.5">Name</label>
            <input id="settings-name" type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Email</label>
            <input type="text" value={user?.email || ''} disabled className="input-field opacity-50 cursor-not-allowed" />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button type="submit" disabled={profileSaving} className="btn-primary text-sm">{profileSaving ? 'Saving...' : 'Save Profile'}</button>
          {profileMsg && <span className={`text-sm ${profileMsg.includes('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>{profileMsg}</span>}
        </div>
      </form>

      {/* Integrations */}
      <form onSubmit={handleSaveIntegrations} className="card">
        <h2 className="text-lg font-bold text-surface-100 mb-4">Integrations</h2>
        <div className="space-y-5">
          {/* GitHub */}
          <div>
            <label htmlFor="settings-github" className="block text-sm font-medium text-surface-300 mb-1.5">GitHub Username</label>
            <div className="flex gap-2">
              <input id="settings-github" type="text" value={github} onChange={e => setGithub(e.target.value)} placeholder="octocat" className="input-field flex-1" />
              <button type="button" onClick={testGitHub} disabled={!github} className="btn-secondary text-sm !px-4 whitespace-nowrap">Test</button>
            </div>
            {githubTest.status !== 'idle' && (
              <div className="flex items-center gap-2 mt-2">
                <StatusDot status={githubTest.status === 'success' ? 'connected' : githubTest.status === 'error' ? 'disconnected' : 'loading'} />
                <span className={`text-xs ${githubTest.status === 'success' ? 'text-emerald-400' : githubTest.status === 'error' ? 'text-red-400' : 'text-brand-400'}`}>{githubTest.message}</span>
              </div>
            )}
          </div>

          {/* LeetCode */}
          <div>
            <label htmlFor="settings-leetcode" className="block text-sm font-medium text-surface-300 mb-1.5">LeetCode Username</label>
            <div className="flex gap-2">
              <input id="settings-leetcode" type="text" value={leetcode} onChange={e => setLeetcode(e.target.value)} placeholder="leetcoder" className="input-field flex-1" />
              <button type="button" onClick={testLeetCode} disabled={!leetcode} className="btn-secondary text-sm !px-4 whitespace-nowrap">Test</button>
            </div>
            {leetcodeTest.status !== 'idle' && (
              <div className="flex items-center gap-2 mt-2">
                <StatusDot status={leetcodeTest.status === 'success' ? 'connected' : leetcodeTest.status === 'error' ? 'disconnected' : 'loading'} />
                <span className={`text-xs ${leetcodeTest.status === 'success' ? 'text-emerald-400' : leetcodeTest.status === 'error' ? 'text-red-400' : 'text-brand-400'}`}>{leetcodeTest.message}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button type="submit" disabled={integrationSaving} className="btn-primary text-sm">{integrationSaving ? 'Saving...' : 'Save Integrations'}</button>
          {integrationMsg && <span className={`text-sm ${integrationMsg.includes('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>{integrationMsg}</span>}
        </div>
      </form>
    </div>
  )
}
