import React, { useEffect, useState } from 'react'
import Card from '../components/Card'

export default function History(){
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(()=>{
    setItems(JSON.parse(localStorage.getItem('summaries')||'[]'))
  },[])

  function remove(id){
    const next = items.filter(i=>i.id!==id)
    setItems(next)
    localStorage.setItem('summaries', JSON.stringify(next))
  }

  const filtered = items.filter(item => {
    if (filter === 'url') return item.url
    if (filter === 'text') return item.mode === 'text'
    if (filter === 'news') return item.mode === 'news'
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date)
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date)
    if (sortBy === 'longest') return b.summary.length - a.summary.length
    return a.summary.length - b.summary.length
  })

  const getInputType = (item) => {
    if (item.url) return 'URL'
    if (item.mode === 'text') return 'Text'
    if (item.mode === 'news') return 'News'
    return 'Unknown'
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">⏰ History</h3>
        <p className="text-slate-400 text-sm mt-1">{sorted.length} of {items.length} summary{items.length !== 1 ? 's' : ''}</p>
      </div>

      {items.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          <div>
            <label className="text-sm text-slate-300 mb-1 block">Filter by type:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="all">📋 All Types</option>
              <option value="url">🔗 From URL</option>
              <option value="text">📝 From Text</option>
              <option value="news">📰 From News</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-1 block">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="newest">🆕 Newest First</option>
              <option value="oldest">📅 Oldest First</option>
              <option value="longest">📏 Longest</option>
              <option value="shortest">📐 Shortest</option>
            </select>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <Card>
          <div className="py-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-slate-400">
              {items.length === 0 ? 'No history yet' : 'No summaries match your filters'}
            </p>
            <p className="text-slate-500 text-sm mt-1">Summaries you generate will appear here</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((it, idx) => (
            <Card key={it.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-mono text-slate-400">#{sorted.length - idx}</span>
                    <span className="text-xs px-2 py-1 bg-blue-900/40 rounded text-blue-300">
                      {getInputType(it)}
                    </span>
                    <span className="text-xs px-2 py-1 bg-indigo-900/40 rounded text-indigo-300">
                      {it.language?.toUpperCase() || 'EN'}
                    </span>
                    <span className="text-xs text-slate-400 ml-auto">
                      {new Date(it.date).toLocaleDateString()} {new Date(it.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="font-semibold text-slate-100 mb-2">{it.title}</div>
                  
                  <p className="text-slate-400 text-sm line-clamp-2">{it.summary}</p>

                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                    <span>📊 {it.summary.split(' ').length} words</span>
                    {it.url && <span>🔗 {new URL(it.url).hostname}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button 
                    onClick={()=>navigator.clipboard.writeText(it.summary)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition"
                  >
                    📋 Copy
                  </button>
                  <button 
                    onClick={()=>remove(it.id)}
                    className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-sm font-medium transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
