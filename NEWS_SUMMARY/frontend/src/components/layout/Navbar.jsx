import React from 'react'
import { Menu } from 'lucide-react'
import ThemeToggle from '../ThemeToggle'

export default function Navbar({ title = 'Workspace', subtitle = 'Summarize and organize your reading', onMenuToggle }){
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg">{title}</h1>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 text-sm font-bold text-white shadow-md">NS</div>
        </div>
      </div>
    </header>
  )
}
