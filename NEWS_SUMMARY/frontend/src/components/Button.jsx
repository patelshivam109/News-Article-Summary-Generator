import React from 'react'
import clsx from 'clsx'

export default function Button({ children, variant = 'primary', className = '', ...props }){
  const base = 'inline-flex items-center gap-2 font-semibold rounded-xl px-4 py-2 transition-all'
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:scale-[1.01] ',
    ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900'
  }
  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  )
}
