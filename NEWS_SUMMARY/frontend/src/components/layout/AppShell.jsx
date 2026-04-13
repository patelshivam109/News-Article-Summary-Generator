import React from 'react'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function AppShell({ title, subtitle, children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen md:flex bg-slate-50 dark:bg-slate-950">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title={title}
          subtitle={subtitle}
          onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)}
        />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
