import React from 'react'
import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">NewsSummary</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/summarize">Text</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/news">News</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/url">URL</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/features">Features</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container my-5">{children}</main>

      <footer className="bg-light py-4 mt-5">
        <div className="container text-center text-muted">© NewsSummary</div>
      </footer>
    </div>
  )
}
