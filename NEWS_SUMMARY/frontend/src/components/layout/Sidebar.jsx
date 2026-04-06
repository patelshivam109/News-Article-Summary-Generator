import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Clock, Bookmark, Settings } from 'lucide-react'

const items = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/settings', label: 'Settings', icon: Settings }
]

export default function Sidebar(){
  const loc = useLocation()
  return (
    <aside className="w-72 p-6 bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800 hidden md:block">
      <div className="mb-8">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">BrieflyAI</div>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Summarize news at speed</div>
      </div>

      <nav className="space-y-2">
        {items.map(it=>{
          const Icon = it.icon
          const active = loc.pathname === it.to
          return (
            <Link key={it.to} to={it.to} className={`flex items-center gap-3 p-3 rounded-xl ${active? 'bg-indigo-600 text-white shadow-md': 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
              <Icon size={18} />
              <span>{it.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
