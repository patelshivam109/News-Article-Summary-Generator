import React from 'react'

export default function Card({ children, className = '' }){
  return (
    <div className={`bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 backdrop-blur-md rounded-2xl shadow-lg p-6 ${className}`}>
      {children}
    </div>
  )
}
