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

  return (
    <button className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={()=>setMode(m=> m==='dark'? 'light':'dark')} title="Toggle theme">
      {mode==='dark' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
