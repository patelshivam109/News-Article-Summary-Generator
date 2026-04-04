import React from 'react'

export default function Input({ className = '', ...props }){
  return (
    <input className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 ${className}`} {...props} />
  )
}
