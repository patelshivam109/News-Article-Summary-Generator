import React from 'react'
import { motion } from 'framer-motion'

export default function Modal({ open, onClose, children }){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{scale:0.97, opacity:0}} animate={{scale:1, opacity:1}} className="relative z-10 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl w-full max-w-2xl">
        {children}
      </motion.div>
    </div>
  )
}
