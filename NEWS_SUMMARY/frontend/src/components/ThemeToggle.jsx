import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle(){
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(()=>{
    const root = document.documentElement
    if(mode==='dark'){
      root.classList.add('dark')
      document.body.setAttribute('data-theme','dark')
    } else {
      root.classList.remove('dark')
      document.body.setAttribute('data-theme','light')
    }
    localStorage.setItem('theme', mode)
  },[mode])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const saved = localStorage.getItem('theme')
      if (saved !== 'light' && saved !== 'dark') {
        setMode(media.matches ? 'dark' : 'light')
      }
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return (
    <button
      aria-label="Toggle color mode"
      aria-pressed={mode === 'dark'}
      className="group relative inline-flex items-center gap-2 rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      onClick={()=>setMode(m=> m==='dark'? 'light':'dark')}
      title="Toggle theme"
    >
      <span className="absolute -inset-px rounded-xl opacity-0 transition group-hover:opacity-100 ring-2 ring-brand-500/20" />
      {mode==='dark' ? <Moon size={18} /> : <Sun size={18} />}
      <span>{mode === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  )
}
