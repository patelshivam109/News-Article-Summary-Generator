import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle(){
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'dark')

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
    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={()=>setMode(m=> m==='dark'? 'light':'dark')} title="Toggle theme">
      {mode==='dark' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
