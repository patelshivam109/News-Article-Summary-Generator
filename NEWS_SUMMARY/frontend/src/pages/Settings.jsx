import React from 'react'
import Card from '../components/Card'
import ThemeToggle from '../components/ThemeToggle'

export default function Settings(){
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Settings</h3>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Theme</div>
            <div className="text-sm text-slate-500">Toggle dark / light mode</div>
          </div>
          <ThemeToggle />
        </div>
      </Card>
    </div>
  )
}
