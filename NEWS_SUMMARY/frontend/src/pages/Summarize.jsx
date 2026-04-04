import React, { useState } from 'react'
import axios from 'axios'

export default function Summarize(){
  const [text, setText] = useState('')
  const [lang, setLang] = useState('en')
  const [length, setLength] = useState('medium')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  function mapLengthToCount(l){
    return l==='short'? 2 : l==='long'? 8 : 5
  }

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    try{
      const res = await axios.post('/api/summarize', { text, language: lang, sentence_count: mapLengthToCount(length) })
      setSummary(res.data.summary)
    }catch(err){
      setSummary('Error generating summary')
    }finally{setLoading(false)}
  }

  return (
    <div>
      <h2>Summarize Text</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-3">
          <label className="form-label">Text</label>
          <textarea className="form-control" rows={8} value={text} onChange={e=>setText(e.target.value)} />
        </div>
        <div className="row align-items-center gx-2">
          <div className="col-auto">
            <select className="form-select" value={lang} onChange={e=>setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
              <option value="te">Telugu</option>
              <option value="bho">Bhojpuri</option>
            </select>
          </div>
          <div className="col-auto">
            <select className="form-select" value={length} onChange={e=>setLength(e.target.value)}>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
          <div className="col">
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading? 'Summarizing...':'Summarize'}</button>
          </div>
        </div>
      </form>

      {summary && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Summary</h5>
            <p className="card-text">{summary}</p>
            <div className="d-flex gap-2">
              <audio controls src={`/tts?text=${encodeURIComponent(summary)}&lang=${lang}`} />
              <button className="btn btn-outline-secondary" onClick={()=>{navigator.clipboard.writeText(summary)}}>Copy</button>
              <button className="btn btn-outline-secondary" onClick={()=>{const blob=new Blob([summary],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='summary.txt';a.click();URL.revokeObjectURL(url);}}>Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
