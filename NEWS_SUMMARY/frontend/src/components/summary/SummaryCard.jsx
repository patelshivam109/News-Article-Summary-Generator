import React, { useState } from 'react'
import Card from '../ui/Card'

export default function SummaryCard({ title, summary, points = [], sentiment = 'Neutral', language = 'en' }){
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [copied, setCopied] = useState(false)

  // TTS using browser SpeechSynthesis API
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in your browser')
      return
    }

    const utterance = new SpeechSynthesisUtterance(summary)
    utterance.lang = getLanguageCode(language)
    utterance.rate = 1
    utterance.pitch = 1

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => {
      setIsSpeaking(false)
      alert('Error speaking text')
    }

    window.speechSynthesis.cancel() // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const getLanguageCode = (lang) => {
    const codes = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'mr': 'mr-IN',
      'te': 'te-IN',
      'bho': 'hi-IN'
    }
    return codes[lang] || 'en-US'
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('Failed to copy summary')
    }
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
          <div className="flex items-center gap-2 mt-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{sentiment}</span>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{language.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">{summary}</p>

      {/* Key Points */}
      {points && points.length > 0 && (
        <div className="mt-5">
          <h5 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Key Points</h5>
          <ul className="space-y-2">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1 text-brand-500">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={handleSpeak}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium ${
            isSpeaking
              ? 'bg-red-600 text-white'
              : 'bg-brand-600 hover:bg-brand-700 text-white'
          }`}
        >
          {isSpeaking ? 'Stop' : 'Listen'}
        </button>
        
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100'
          }`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>

        <button className="flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600">
          Share
        </button>
      </div>
    </Card>
  )
}
