import React from 'react'
import ThemeToggle from './ThemeToggle'

export default function TopNav(){
  return (
    <header className="flex items-center justify-between gap-4 p-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <h4 className="text-lg font-semibold">Dashboard</h4>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/60 dark:bg-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">S</div>
          <div className="text-sm">
            <div className="font-medium">Sam Patel</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Pro</div>
          </div>
        </div>
      </div>
    </header>
  )
}
