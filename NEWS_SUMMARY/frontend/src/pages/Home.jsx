import React from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Home() {
  return (
    <AppShell title="Overview" subtitle="A clean workspace for fast article intelligence">
      <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          Build crisp summaries from URLs, text, and trending topics.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Designed for newsroom speed and research clarity, with multilingual output and reusable history.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/">
            <Button>Open Dashboard</Button>
          </Link>
          <Link to="/saved">
            <Button variant="ghost">View Saved</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">URL Intelligence</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Extract concise context from long-form articles in seconds.</p>
        </Card>
        <Card>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Clean Key Points</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Get bullet highlights optimized for readability and sharing.</p>
        </Card>
        <Card>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Reliable Workflow</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Save, recall, and reuse summaries across your day-to-day work.</p>
        </Card>
      </section>
    </AppShell>
  )
}
