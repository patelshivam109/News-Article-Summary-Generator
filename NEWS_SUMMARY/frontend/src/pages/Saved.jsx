import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Card from '../components/ui/Card'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'

export default function Saved(){
  const [items, setItems] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSummaries()
  }, [])

  const loadSummaries = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get('http://localhost:5000/api/saved?page=1&limit=100')
      setItems(res.data.summaries || [])
    } catch (e) {
      // Fallback keeps app usable even if backend is down.
      const saved = JSON.parse(localStorage.getItem('summaries') || '[]')
      setItems(saved)
      if (!saved.length) setError('Backend unavailable. Showing local data.')
    } finally {
      setLoading(false)
    }
  }

  const deleteSummary = async (id) => {
    if (!window.confirm('Delete this summary?')) return
    try {
      await axios.delete(`http://localhost:5000/api/saved/${id}`)
      setItems(items.filter(item => item.id !== id))
    } catch (e) {
      const updated = items.filter(item => item.id !== id)
      setItems(updated)
      localStorage.setItem('summaries', JSON.stringify(updated))
    }
  }

  const copySummary = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('✓ Copied to clipboard')
    } catch {
      alert('Failed to copy')
    }
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-slate-900 text-slate-100">
        <Navbar />
        <main className="p-6">
          <div className="max-w-4xl">
            <div className="mb-6">
              <h3 className="text-2xl font-bold">📚 Saved Summaries</h3>
              <p className="text-slate-400 text-sm mt-1">{items.length} summary{items.length !== 1 ? 's' : ''} saved</p>
            </div>

            {loading && (
              <Card className="mb-4">
                <p className="text-slate-400">Loading saved summaries...</p>
              </Card>
            )}

            {!loading && error && (
              <Card className="mb-4 border-l-4 border-amber-500 bg-amber-500/5">
                <p className="text-amber-300 text-sm">{error}</p>
              </Card>
            )}

            {!loading && items.length === 0 ? (
              <Card className="py-16 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-slate-400">No saved summaries yet</p>
                <p className="text-slate-500 text-sm mt-1">Generate and save a summary to see it here</p>
              </Card>
            ) : !loading && (
              <div className="grid gap-4">
                {items.map(item => (
                  <Card key={item.id} className="hover:bg-slate-800/50 transition">
                    <button
                      onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-100 hover:text-indigo-400 transition">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                            <span className="text-xs px-2 py-1 bg-indigo-900/40 rounded text-indigo-300">
                              {item.language?.toUpperCase() || 'EN'}
                            </span>
                            {item.url && (
                              <span className="text-xs px-2 py-1 bg-emerald-900/40 rounded text-emerald-300">
                                🔗 URL
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                            {item.summary}
                          </p>
                        </div>
                        <div className="ml-4 text-slate-400">
                          {expanded === item.id ? '▼' : '▶'}
                        </div>
                      </div>
                    </button>

                    {expanded === item.id && (
                      <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                        <div>
                          <h5 className="text-sm font-semibold text-slate-200 mb-2">Full Summary</h5>
                          <p className="text-slate-300 leading-relaxed text-sm">{item.summary}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => copySummary(item.summary)}
                            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
                          >
                            📋 Copy
                          </button>
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg text-sm font-medium transition"
                            >
                              🔗 View Source
                            </a>
                          )}
                          <button
                            onClick={() => deleteSummary(item.id)}
                            className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium transition ml-auto"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
