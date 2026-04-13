import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Clock, Bookmark, Settings, Sparkles, X } from 'lucide-react'

const items = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/home', label: 'Overview', icon: Sparkles },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/settings', label: 'Settings', icon: Settings }
]

export default function Sidebar({ mobileOpen = false, onClose = () => {} }){
  const loc = useLocation()

  const sidebarContent = (
    <>
      <div className="mb-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-4 dark:border-slate-800 dark:from-brand-900/20 dark:to-slate-950">
        <div className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">News Summary Studio</div>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Editorial-grade AI condensing</div>
      </div>

      <nav className="space-y-2">
        {items.map(it=>{
          const Icon = it.icon
          const active = loc.pathname === it.to
          return (
            <Link
              key={it.to}
              to={it.to}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20': 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'}`}
            >
              <Icon size={18} />
              <span>{it.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        Tip: URL mode works best for long articles; Text mode is ideal for notes and meeting transcripts.
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 dark:border-slate-800 dark:bg-slate-950 md:block">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            onClick={onClose}
            aria-label="Close menu overlay"
          />

          <aside className="relative z-50 h-full w-[86%] max-w-[320px] border-r border-slate-200 bg-white px-5 py-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
