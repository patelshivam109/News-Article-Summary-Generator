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
    // Removed duplicate loading state declaration

  async function generate(){
    // deprecated; kept for compatibility
    return
  }

  function saveSummary(){
    if(!result || result.error) return
    const store = JSON.parse(localStorage.getItem('summaries')||'[]')
    const item = {
      id: Date.now(),
      title: result.title || (result.summary? (result.summary.slice(0,60) + (result.summary.length>60? '...':'')) : 'Summary'),
      summary: result.summary || '',
      url: result.url || null,
      date: new Date().toISOString()
    }
    store.unshift(item)
    localStorage.setItem('summaries', JSON.stringify(store))
    alert('Saved to history')
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-slate-900 text-slate-100">
        <Navbar />
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <InputPanel onGenerate={async ({ input: value, mode, language, length })=>{
                setLoading(true)
                setResult(null)
                try{
                  if(mode === 'url'){
                    const res = await axios.post('/api/url', { url: value, language, sentence_count: length==='short'?2: length==='long'?8:5 })
                    setResult(res.data)
                  } else if(mode === 'text'){
                    const res = await axios.post('/api/summarize', { text: value, language, sentence_count: length==='short'?2: length==='long'?8:5 })
                    setResult({ summary: res.data.summary })
                  } else if(mode === 'news'){
                    const res = await axios.post('/api/news', { keyword: value, language, sentence_count: length==='short'?2: length==='long'?8:5 })
                    // show first article's summary as example
                    if(res.data.articles && res.data.articles.length>0){
                      setResult(res.data.articles[0])
                    } else {
                      setResult({ error: 'No articles found' })
                    }
                  }
                }catch(e){ setResult({ error: 'Failed to generate summary' }) }
                setLoading(false)
              }} />

              <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{delay:0.05}} className="mt-6">
                {loading && <Skeleton />}
                {!loading && !result && (
                  <Card className="py-16 text-center text-slate-400">No summary yet — generate one to see results here.</Card>
                )}

                {!loading && result && !result.error && (
                  <SummaryCard title={result.title || 'Result'} summary={result.summary} points={result.key_points || []} sentiment={result.sentiment || 'Neutral'} />
                )}

                {!loading && result && result.error && (
                  <Card className="text-red-400">{result.error}</Card>
                )}
              </motion.div>
            </div>

            <div>
              <Card>
                <h5 className="font-semibold mb-2 text-slate-100">Quick Actions</h5>
                <div className="flex flex-col gap-3">
                  <Button className="w-full" onClick={saveSummary}>Save Summary</Button>
                  <Button variant="ghost" className="w-full" onClick={()=>{if(!result) return; const win=window.open(); win.document.write(`<pre>${(result.summary||'')}</pre>`); win.document.title='Summary'; win.print();}}>Export / Print</Button>
                </div>
              </Card>

              <Card className="mt-4">
                <h6 className="text-sm text-slate-400 mb-3">Usage Tips</h6>
                <ul className="text-sm space-y-2 text-slate-300">
                  <li>Paste full article URLs for best results.</li>
                  <li>Use text mode to summarize long pasted text.</li>
                </ul>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
