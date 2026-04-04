import React from 'react'
import Card from '../ui/Card'

export default function SummaryCard({ title, summary, points = [], sentiment = 'Neutral' }){
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-lg">{title}</h4>
          <p className="mt-3 text-slate-300">{summary}</p>
        </div>
        <div className="text-sm">
          <div className="px-3 py-1 rounded-full bg-slate-800 text-slate-200">{sentiment}</div>
        </div>
      </div>

      {points && points.length>0 && (
        <ul className="mt-4 space-y-2 list-disc list-inside text-slate-300">
          {points.map((p,i)=>(<li key={i}>{p}</li>))}
        </ul>
      )}
    </Card>
  )
}
