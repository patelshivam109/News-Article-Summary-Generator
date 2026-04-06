import React, { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
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
      await axios.post('http://localhost:5000/api/saved', {
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
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <Navbar />
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <InputPanel onGenerate={async ({ input: value, mode, language, length })=>{
                setLoading(true)
                setResult(null)
                setError('')
                setSelectedLanguage(language)
                try{
                  if(mode === 'url'){
                    const res = await axios.post('http://localhost:5000/api/url', { 
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
                    const res = await axios.post('http://localhost:5000/api/summarize', { 
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
                    const res = await axios.post('http://localhost:5000/api/news', { 
                      keyword: value, 
                      language, 
                      sentence_count: length==='short'?2: length==='long'?8:5 
                    })
                    // show first article's summary as example
                    if(res.data.articles && res.data.articles.length>0){
                      setResult(res.data.articles[0])
                      setError('')
                    } else {
                      setError('No articles found. Try a different keyword.')
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
                  <Card className="py-16 text-center text-slate-400">
                    <div className="text-4xl mb-3">📝</div>
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
                  <Card className="border-l-4 border-red-500 bg-red-500/5">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <h5 className="font-semibold text-red-400">Error</h5>
                        <p className="text-sm text-red-300 mt-1">{error}</p>
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            </div>

            {/* Sidebar Panel */}
            <div>
              {/* Quick Actions */}
              <Card>
                <h5 className="font-semibold mb-4 text-slate-100">⚡ Quick Actions</h5>
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
                    🖨️ Print
                  </Button>
                </div>
              </Card>

              {/* Tips */}
              <Card className="mt-4">
                <h6 className="text-sm font-semibold text-slate-200 mb-3">💡 Tips</h6>
                <ul className="text-xs space-y-2 text-slate-400">
                  <li>✓ Paste full URLs for best results</li>
                  <li>✓ Use text mode for pasted content</li>
                  <li>✓ News mode searches current news</li>
                  <li>✓ Select your preferred language</li>
                  <li>✓ Use 🔊 button to listen</li>
                </ul>
              </Card>

              {/* Stats */}
              {result && !result.error && (
                <Card className="mt-4 bg-slate-800/50">
                  <h6 className="text-sm font-semibold text-slate-200 mb-3">📊 Stats</h6>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Original:</span>
                      <span className="text-indigo-400 font-medium">{(result.url || 'Custom').length > 20 ? (result.url || 'Custom').slice(0, 20) + '...' : result.url || 'Text'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Summary length:</span>
                      <span className="text-indigo-400 font-medium">{(result.summary || '').split(' ').length} words</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
