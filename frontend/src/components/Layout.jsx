import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
