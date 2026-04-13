import React, { useState } from 'react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function InputPanel({ onGenerate }){
  const [mode, setMode] = useState('url') // 'url' | 'text' | 'news'
  const [value, setValue] = useState('')
  const [language, setLanguage] = useState('en')
  const [length, setLength] = useState('medium')
  const [inputError, setInputError] = useState('')

  const handleGenerate = () => {
    // Validate input
    if (!value.trim()) {
      setInputError(`Please enter ${mode === 'url' ? 'a URL' : mode === 'text' ? 'some text' : 'a keyword'}`)
      return
    }
    
    // URL validation
    if (mode === 'url' && !isValidUrl(value)) {
      setInputError('Please enter a valid URL (starting with http:// or https://)')
      return
    }

    setInputError('')
    onGenerate({ input: value, mode, language, length })
  }

  const isValidUrl = (str) => {
    try {
      new URL(str)
      return true
    } catch {
      return false
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Generate Summary</h5>
        <div className="text-sm text-slate-500 dark:text-slate-400">Input Mode</div>
      </div>

      {/* Mode Selector */}
      <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {['url', 'text', 'news'].map(m => (
          <button 
            key={m}
            className={`px-3 py-2 rounded-lg transition text-sm font-medium ${
              mode === m 
                ? 'bg-brand-600 text-white shadow-sm' 
                : 'bg-transparent text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
            }`} 
            onClick={() => {
              setMode(m)
              setValue('')
              setInputError('')
            }}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Input Field */}
      {mode === 'url' && (
        <Input 
          placeholder="https://example.com/article"
          value={value} 
          onChange={e => {
            setValue(e.target.value)
            setInputError('')
          }}
        />
      )}
      {mode === 'text' && (
        <textarea 
          className="w-full min-h-[120px] rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-brand-900/40"
          placeholder="Paste your article or paragraph..."
          value={value} 
          onChange={e => {
            setValue(e.target.value)
            setInputError('')
          }}
        />
      )}
      {mode === 'news' && (
        <Input 
          placeholder="e.g., AI, Technology, Science..."
          value={value} 
          onChange={e => {
            setValue(e.target.value)
            setInputError('')
          }}
        />
      )}

      {/* Error Message */}
      {inputError && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {inputError}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3 mt-4 flex-wrap">
        <select 
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          value={language} 
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="en"> English</option>
          <option value="hi"> Hindi</option>
          <option value="mr"> Marathi</option>
          <option value="te"> Telugu</option>
          <option value="bho"> Bhojpuri</option>
        </select>

        <select 
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          value={length} 
          onChange={e => setLength(e.target.value)}
        >
          <option value="short"> Short (2 sent.)</option>
          <option value="medium"> Medium (5 sent.)</option>
          <option value="long"> Long (8 sent.)</option>
        </select>

        <div className="flex-1" />
        <Button onClick={handleGenerate} className="whitespace-nowrap">
          Generate Summary
        </Button>
      </div>
    </Card>
  )
}
