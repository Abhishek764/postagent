import React, { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/auth.store.js'
import client from '../api/client.js'

export default function Navbar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    try {
      await client.post('/auth/logout')
    } catch {
      // Soft fail
    }
    clearAuth()
    navigate('/login')
  }

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/generate', label: 'Generate' },
    { to: '/history', label: 'History' },
    { to: '/settings', label: 'Settings' }
  ]

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <nav className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <span className="text-surface-950 font-bold text-sm">P</span>
            </div>
            <span className="font-mono font-bold text-lg text-surface-100">
              Post<span className="text-brand-500">Agent</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-surface-800 text-brand-400'
                      : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* User avatar + dropdown */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-surface-950 text-sm font-bold hover:shadow-lg hover:shadow-brand-500/20 transition-all duration-200"
              >
                {getInitials(user?.name)}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-900 border border-surface-700 rounded-xl shadow-xl shadow-black/20 py-1 animate-slide-down">
                  <div className="px-4 py-2 border-b border-surface-800">
                    <p className="text-sm font-medium text-surface-100">{user?.name}</p>
                    <p className="text-xs text-surface-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-surface-300 hover:bg-surface-800 hover:text-surface-100 transition-colors"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-surface-800 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-surface-800 py-3 animate-slide-down">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-surface-800 text-brand-400'
                      : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="border-t border-surface-800 mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-surface-800 rounded-lg transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
