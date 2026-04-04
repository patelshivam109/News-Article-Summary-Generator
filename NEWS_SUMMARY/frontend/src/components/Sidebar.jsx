import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Clock, Bookmark, Settings } from 'lucide-react'

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/settings', label: 'Settings', icon: Settings }
]

export default function Sidebar(){
  const loc = useLocation()
  return (
    <aside className="w-72 p-4 hidden md:block">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">NewsSummary</h3>
        <p className="text-sm text-slate-500">Concise insights, fast.</p>
      </div>

      <nav className="space-y-2">
        {items.map(it=>{
          const Icon = it.icon
          const active = loc.pathname === it.to
          return (
            <Link key={it.to} to={it.to} className={`flex items-center gap-3 p-3 rounded-xl ${active? 'bg-indigo-600 text-white shadow-md': 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}>
              <Icon size={18} />
              <span>{it.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
