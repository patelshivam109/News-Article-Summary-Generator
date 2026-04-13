import React, { useState } from 'react'
import AppShell from '../components/layout/AppShell'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import InputPanel from '../components/summary/InputPanel'
import SummaryCard from '../components/summary/SummaryCard'
import { motion } from 'framer-motion'
import axios from 'axios'

function Skeleton(){
  return (
    <div className="space-y-3">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
      <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
    </div>
  )
}

export default function Dashboard(){
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [error, setError] = useState('')

  async function saveSummary(){
    if(!result || result.error) return
    const item = {
      id: Date.now(),
      title: result.title || (result.summary? (result.summary.slice(0,60) + (result.summary.length>60? '...':'')) : 'Summary'),
      summary: result.summary || '',
      url: result.url || null,
      date: new Date().toISOString(),
      language: selectedLanguage
    }
    try {
      await axios.post('/api/saved', {
        title: item.title,
        summary: item.summary,
        url: item.url,
        language: item.language,
        mode: result.url ? 'url' : 'text'
      })
      alert('✓ Saved to backend')
    } catch (e) {
      const store = JSON.parse(localStorage.getItem('summaries')||'[]')
      store.unshift(item)
      localStorage.setItem('summaries', JSON.stringify(store))
      alert('✓ Saved locally (backend unavailable)')
    }
  }

  return (
    <AppShell title="Dashboard" subtitle="Generate concise article intelligence in one place">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <InputPanel onGenerate={async ({ input: value, mode, language, length })=>{
                setLoading(true)
                setResult(null)
                setError('')
                setSelectedLanguage(language)
                try{
                  if(mode === 'url'){
                    const res = await axios.post('/api/url', { 
                      url: value, 
                      language, 
                      sentence_count: length==='short'?2: length==='long'?8:5 
                    })
                    if(res.data.error){
                      setError(res.data.error)
                      setResult(null)
                    } else {
                      setResult(res.data)
                      setError('')
                    }
                  } else if(mode === 'text'){
                    const res = await axios.post('/api/summarize', { 
                      text: value, 
                      language, 
                      sentence_count: length==='short'?2: length==='long'?8:5 
                    })
                    if(res.data.error){
                      setError(res.data.error)
                      setResult(null)
                    } else {
                      setResult({ summary: res.data.summary, title: 'Text Summary' })
                      setError('')
                    }
                  } else if(mode === 'news'){
                    const res = await axios.post('/api/news', { 
                      keyword: value, 
                      language, 
                      sentence_count: length==='short'?2: length==='long'?8:5 
                    })
                    const articles = Array.isArray(res.data?.articles) ? res.data.articles : []

                    if(articles.length > 0){
                      const first = articles[0]
                      setResult({
                        title: first.title || 'News Summary',
                        summary: first.summary || first.description || 'No summary available for this article.',
                        url: first.url || null,
                        key_points: first.key_points || [],
                        sentiment: first.sentiment || 'Neutral',
                      })
                      setError('')
                    } else {
                      setError('No articles found for this keyword. Try a broader topic.')
                      setResult(null)
                    }
                  }
                }catch(e){ 
                  console.error('API Error:', e)
                  const errorMsg = e.response?.data?.error || e.message || 'Failed to generate summary. Please try again.'
                  setError(errorMsg)
                  setResult(null)
                }
                setLoading(false)
              }} />

              <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:0.05}} className="mt-6">
                {loading && <Skeleton />}
                
                {!loading && !result && !error && (
                  <Card className="py-16 text-center text-slate-500 dark:text-slate-400">
                    <div className="mb-3 text-4xl">Summary</div>
                    Generate a summary to see results here
                  </Card>
                )}

                {!loading && result && !result.error && (
                  <SummaryCard 
                    title={result.title || 'Result'} 
                    summary={result.summary} 
                    points={result.key_points || []} 
                    sentiment={result.sentiment || 'Neutral'}
                    language={selectedLanguage}
                  />
                )}

                {!loading && error && (
                  <Card className="border-l-4 border-red-500 bg-red-50 dark:bg-red-500/10">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">!</span>
                      <div>
                        <h5 className="font-semibold text-red-700 dark:text-red-300">Error</h5>
                        <p className="mt-1 text-sm text-red-700/90 dark:text-red-200">{error}</p>
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            </div>

            <div>
              <Card>
                <h5 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">Quick Actions</h5>
                <div className="flex flex-col gap-2">
                  <Button 
                    className="w-full text-sm" 
                    onClick={saveSummary}
                    disabled={!result || result.error}
                  >
                    💾 Save Summary
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm" 
                    onClick={()=>{
                      if(!result || result.error) return
                      const win=window.open()
                      win.document.write(`
                        <html>
                          <head><title>Summary</title></head>
                          <body style="font-family: Arial; line-height: 1.6; padding: 20px;">
                            <h2>${result.title || 'Summary'}</h2>
                            <p>${result.summary || ''}</p>
                          </body>
                        </html>
                      `)
                      win.print()
                    }}
                    disabled={!result || result.error}
                  >
                    Print
                  </Button>
                </div>
              </Card>

              <Card className="mt-4">
                <h6 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Editorial Tips</h6>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <li>Use URL mode for long-form reporting.</li>
                  <li>Text mode is best for copied content and notes.</li>
                  <li>Short length gives headline-level briefs.</li>
                  <li>Long length is useful for research snapshots.</li>
                </ul>
              </Card>

              {result && !result.error && (
                <Card className="mt-4">
                  <h6 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Summary Stats</h6>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Source:</span>
                      <span className="font-medium text-brand-700 dark:text-brand-300">{(result.url || 'Custom').length > 20 ? (result.url || 'Custom').slice(0, 20) + '...' : result.url || 'Text'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Summary length:</span>
                      <span className="font-medium text-brand-700 dark:text-brand-300">{(result.summary || '').split(' ').length} words</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>
      </div>
    </AppShell>
  )
}
