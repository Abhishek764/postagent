import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/auth.store.js'
import client from '../api/client.js'
import PostCard from '../components/PostCard.jsx'

export default function Dashboard() {
  const { user } = useAuthStore()
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRecentPosts()
  }, [])

  async function fetchRecentPosts() {
    try {
      const { data } = await client.get('/posts?page=1&limit=3')
      setRecentPosts(data.posts)
    } catch (err) {
      setError('Failed to load recent posts')
    } finally {
      setLoading(false)
    }
  }

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  function getRelativeDate(dateStr) {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now - date) / 86400000)
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays} days ago`
  }

  async function handleDelete(postId) {
    try {
      await client.delete(`/posts/${postId}`)
      setRecentPosts(prev => prev.filter(p => p.id !== postId))
    } catch {
      // ignore
    }
  }

  const stats = [
    { label: 'Current Day', value: user?.currentDay || 1, icon: '📅' },
    { label: 'Current Streak', value: `${user?.streak || 0} 🔥`, icon: null },
    { label: 'Total Posts', value: recentPosts.length > 0 ? (user?.currentDay || 1) - 1 : 0, icon: '📝' },
    { label: 'Last Active', value: getRelativeDate(user?.lastActiveDate), icon: '⏰' }
  ]

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-50 font-mono">
          {getGreeting()}, <span className="text-brand-400">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-surface-500 mt-1">Here's your #CodeTillIGetHired progress.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="card">
            <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-surface-50 font-mono">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="card mb-8 bg-gradient-to-r from-brand-500/10 to-brand-600/5 border-brand-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-surface-50">Ready to write today's post?</h2>
            <p className="text-sm text-surface-400">Your story + your code = LinkedIn gold.</p>
          </div>
          <Link to="/generate" className="btn-primary whitespace-nowrap glow-sm">
            Generate Today's Post →
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-xl font-bold text-surface-50 mb-4">Recent Posts</h2>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card"><div className="skeleton h-20 w-full rounded-lg" /></div>
            ))}
          </div>
        ) : error ? (
          <div className="card text-center py-8">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">🚀</p>
            <h3 className="text-lg font-bold text-surface-100 mb-1">Day 1 starts today.</h3>
            <p className="text-surface-500 text-sm mb-4">Write your first post and begin your journey.</p>
            <Link to="/generate" className="btn-primary inline-flex">Generate Your First Post →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentPosts.map(post => (
              <PostCard key={post.id} post={post} onDelete={handleDelete} />
            ))}
            {recentPosts.length >= 3 && (
              <Link to="/history" className="block text-center text-sm text-brand-400 hover:text-brand-300 py-2 transition-colors">
                View all posts →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
