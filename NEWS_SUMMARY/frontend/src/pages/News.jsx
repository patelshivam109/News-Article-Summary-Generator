import React, { useState } from 'react'
import axios from 'axios'

export default function News(){
  const [keyword, setKeyword] = useState('')
  const [lang, setLang] = useState('en')
  const [length, setLength] = useState('short')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)

  function mapLengthToCount(l){
    return l==='short'? 2 : l==='long'? 8 : 5
  }

  async function handleSearch(e){
    e.preventDefault();
    setLoading(true)
    try{
      const res = await axios.post('/api/news', { keyword, language: lang, sentence_count: mapLengthToCount(length) })
      setArticles(res.data.articles)
    }catch(err){
      setArticles([])
    }finally{setLoading(false)}
  }

  return (
    <div>
      <h2>Search News</h2>
      <form className="row g-2 mb-3" onSubmit={handleSearch}>
        <div className="col-md-6">
          <input className="form-control" placeholder="Keyword" value={keyword} onChange={e=>setKeyword(e.target.value)} />
        </div>
        <div className="col-md-2">
          <select className="form-select" value={lang} onChange={e=>setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
            <option value="te">Telugu</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={length} onChange={e=>setLength(e.target.value)}>
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit" disabled={loading}>{loading? 'Searching...':'Search'}</button>
        </div>
      </form>

      <div className="row">
        {articles.map((a, i) => (
          <div className="col-md-6 mb-3" key={i}>
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{a.title}</h5>
                <p className="text-muted small">{a.source?.name} • {a.publishedAt}</p>
                <p className="card-text">{a.summary}</p>
                <div className="mt-auto d-flex gap-2">
                  <a className="btn btn-outline-primary btn-sm" href={a.url} target="_blank">Open</a>
                  <audio className="ms-2" controls src={`/tts?text=${encodeURIComponent(a.summary)}&lang=${a.language||'en'}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
