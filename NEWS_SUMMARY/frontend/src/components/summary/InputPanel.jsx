import React, { useState } from 'react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function InputPanel({ onGenerate }){
  const [mode, setMode] = useState('url') // 'url' | 'text' | 'news'
  const [value, setValue] = useState('')
  const [language, setLanguage] = useState('en')
  const [length, setLength] = useState('medium')

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-semibold text-slate-100">Generate Summary</h5>
        <div className="text-sm text-slate-400">Input</div>
      </div>

      <div className="flex gap-3 mb-4">
        <button className={`px-3 py-1 rounded-lg ${mode==='url'? 'bg-indigo-600 text-white' : 'bg-transparent text-slate-400'}`} onClick={()=>setMode('url')}>URL</button>
        <button className={`px-3 py-1 rounded-lg ${mode==='text'? 'bg-indigo-600 text-white' : 'bg-transparent text-slate-400'}`} onClick={()=>setMode('text')}>Text</button>
        <button className={`px-3 py-1 rounded-lg ${mode==='news'? 'bg-indigo-600 text-white' : 'bg-transparent text-slate-400'}`} onClick={()=>setMode('news')}>News</button>
      </div>

      {mode === 'url' && (
        <Input placeholder="Paste article URL here" value={value} onChange={e=>setValue(e.target.value)} />
      )}
      {mode === 'text' && (
        <textarea className="w-full rounded-2xl border border-slate-700 bg-transparent px-4 py-3 min-h-[140px]" value={value} onChange={e=>setValue(e.target.value)} />
      )}
      {mode === 'news' && (
        <Input placeholder="Enter keyword to search news" value={value} onChange={e=>setValue(e.target.value)} />
      )}

      <div className="flex items-center gap-3 mt-4">
        <select className="form-select w-auto" value={language} onChange={e=>setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
        <select className="form-select w-auto" value={length} onChange={e=>setLength(e.target.value)}>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
        <div className="flex-1" />
        <Button onClick={()=>onGenerate({ input: value, mode, language, length })}>Generate</Button>
      </div>
    </Card>
  )
}
