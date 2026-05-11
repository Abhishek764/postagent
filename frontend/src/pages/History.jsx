import React, { useState, useEffect } from 'react'
import client from '../api/client.js'
import PostCard from '../components/PostCard.jsx'

export default function History() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchPosts() }, [page])

  async function fetchPosts() {
    setLoading(true)
    setError('')
    try {
      const { data } = await client.get(`/posts?page=${page}&limit=10`)
      setPosts(data.posts)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch (err) {
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(postId) {
    try {
      await client.delete(`/posts/${postId}`)
      setPosts(prev => prev.filter(p => p.id !== postId))
      setTotal(prev => prev - 1)
    } catch {
      // ignore
    }
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-surface-50 font-mono">Post History</h1>
          <p className="text-surface-500 mt-1">{total} post{total !== 1 ? 's' : ''} generated</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="card"><div className="skeleton h-24 w-full rounded-lg" /></div>
          ))}
        </div>
      ) : error ? (
        <div className="card text-center py-12">
          <p className="text-red-400 mb-3">{error}</p>
          <button onClick={fetchPosts} className="btn-secondary text-sm">Try Again</button>
        </div>
      ) : posts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">📭</p>
          <h3 className="text-lg font-bold text-surface-100 mb-1">No posts yet</h3>
          <p className="text-surface-500 text-sm">Generate your first post to see it here.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} onDelete={handleDelete} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm !px-4 !py-2 disabled:opacity-30">
                ← Previous
              </button>
              <span className="text-sm text-surface-500 px-4">
                Page {page} of {totalPages}
              </span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary text-sm !px-4 !py-2 disabled:opacity-30">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
