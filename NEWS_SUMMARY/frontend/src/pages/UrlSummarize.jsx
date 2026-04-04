import React, { useState } from 'react'
import axios from 'axios'

export default function UrlSummarize(){
  const [url, setUrl] = useState('')
  const [lang, setLang] = useState('en')
  const [length, setLength] = useState('medium')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  function mapLengthToCount(l){
    return l==='short'? 2 : l==='long'? 8 : 5
  }

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true)
    try{
      const res = await axios.post('/api/url', { url, language: lang, sentence_count: mapLengthToCount(length) })
      setResult(res.data)
    }catch(err){
      setResult({ error: 'Failed to fetch article' })
    }finally{setLoading(false)}
  }

  return (
    <div>
      <h2>Summarize URL</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-3">
          <input className="form-control" placeholder="https://..." value={url} onChange={e=>setUrl(e.target.value)} />
        </div>
        <div className="d-flex gap-2 align-items-center">
            <select className="form-select w-auto" value={lang} onChange={e=>setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
              <option value="te">Telugu</option>
              <option value="bho">Bhojpuri</option>
            </select>
            <select className="form-select w-auto" value={length} onChange={e=>setLength(e.target.value)}>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading? 'Fetching...':'Fetch & Summarize'}</button>
          </div>
      </form>

      {result && (
        <div className="card">
          <div className="card-body">
            {result.error ? (
              <div className="text-danger">{result.error}</div>
            ) : (
              <>
                <h5>{result.title}</h5>
                <p className="text-muted small">{result.author} • {result.publishedAt}</p>
                <p>{result.summary}</p>
                <audio controls src={`/tts?text=${encodeURIComponent(result.summary)}&lang=${lang}`} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
