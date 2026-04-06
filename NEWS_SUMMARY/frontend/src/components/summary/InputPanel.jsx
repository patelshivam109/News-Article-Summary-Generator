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
        <h5 className="text-lg font-semibold text-slate-100">Generate Summary</h5>
        <div className="text-sm text-slate-400">Input Mode</div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-4 bg-slate-800 p-1 rounded-lg">
        {['url', 'text', 'news'].map(m => (
          <button 
            key={m}
            className={`flex-1 px-3 py-2 rounded-md transition text-sm font-medium ${
              mode === m 
                ? 'bg-indigo-600 text-white' 
                : 'bg-transparent text-slate-400 hover:text-slate-300'
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
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 min-h-[120px] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
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
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          value={language} 
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="en">🇬🇧 English</option>
          <option value="hi">🇮🇳 Hindi</option>
          <option value="mr">🇮🇳 Marathi</option>
          <option value="te">🇮🇳 Telugu</option>
          <option value="bho">🇮🇳 Bhojpuri</option>
        </select>

        <select 
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          value={length} 
          onChange={e => setLength(e.target.value)}
        >
          <option value="short">📝 Short (2 sent.)</option>
          <option value="medium">📋 Medium (5 sent.)</option>
          <option value="long">📄 Long (8 sent.)</option>
        </select>

        <div className="flex-1" />
        <Button onClick={handleGenerate} className="whitespace-nowrap">
          ✨ Generate
        </Button>
      </div>
    </Card>
  )
}
