import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import History from './pages/History'
import Settings from './pages/Settings'
import Saved from './pages/Saved'

import './index.css'

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  )
}
