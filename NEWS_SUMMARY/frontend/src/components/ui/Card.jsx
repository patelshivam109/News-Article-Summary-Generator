import React from 'react'

export default function Card({ children, className = '' }){
  return (
    <div className={`bg-white/6 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg p-6 ${className}`}>
      {children}
    </div>
  )
}
