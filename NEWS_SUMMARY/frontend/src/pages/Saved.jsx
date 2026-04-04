import React, { useEffect, useState } from 'react'
import Card from '../components/ui/Card'

export default function Saved(){
  const [items, setItems] = useState([])
  useEffect(()=> setItems(JSON.parse(localStorage.getItem('saved')||'[]')), [])
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Saved Summaries</h3>
      {items.length===0 ? (
        <Card>
          <div className="text-slate-400">You have no saved summaries.</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map(it=> (
            <Card key={it.id}>
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-slate-400">{new Date(it.date).toLocaleString()}</div>
              <p className="mt-2 text-slate-300">{it.summary.slice(0,200)}{it.summary.length>200?'...':''}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
