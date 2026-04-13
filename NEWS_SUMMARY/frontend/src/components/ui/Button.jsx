import React from 'react'
import clsx from 'clsx'

export default function Button({ children, variant = 'primary', className = '', ...props }){
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition'
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
  }
  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  )
}
