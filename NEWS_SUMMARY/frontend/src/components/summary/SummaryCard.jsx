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
          <h4 className="font-semibold text-lg text-slate-100">{title}</h4>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-200 text-sm">{sentiment}</span>
            <span className="px-3 py-1 rounded-full bg-indigo-900/40 text-indigo-300 text-sm">{language.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-slate-300 leading-relaxed text-base">{summary}</p>

      {/* Key Points */}
      {points && points.length > 0 && (
        <div className="mt-5">
          <h5 className="text-sm font-semibold text-slate-200 mb-2">📌 Key Points:</h5>
          <ul className="space-y-2">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-indigo-400 mt-1">•</span>
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
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isSpeaking ? '⏸ Stop' : '🔊 Listen'}
        </button>
        
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-100'
          }`}
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 transition text-sm font-medium">
          📥 Share
        </button>
      </div>
    </Card>
  )
}
