import React from 'react'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="display-5">Professional News Summaries</h1>
      <p className="lead">Quickly summarize text, articles, or search the news.</p>
      <div className="d-flex justify-content-center gap-2 mt-4">
        <a className="btn btn-primary" href="/summarize">Summarize Text</a>
        <a className="btn btn-outline-primary" href="/news">Search News</a>
      </div>
    </div>
  )
}
