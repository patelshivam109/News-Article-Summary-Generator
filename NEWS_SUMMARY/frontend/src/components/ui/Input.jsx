import React from 'react'

export default function Input({ className = '', ...props }){
  return (
    <input className={`w-full rounded-2xl border border-slate-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${className}`} {...props} />
  )
}
