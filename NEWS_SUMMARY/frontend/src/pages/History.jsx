import React, { useEffect, useState } from 'react'
import Card from '../components/Card'

export default function History(){
  const [items, setItems] = useState([])

  useEffect(()=>{
    setItems(JSON.parse(localStorage.getItem('summaries')||'[]'))
  },[])

  function remove(id){
    const next = items.filter(i=>i.id!==id)
    setItems(next)
    localStorage.setItem('summaries', JSON.stringify(next))
  }

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">History</h3>
      {items.length===0 ? (
        <Card>
          <div className="text-slate-500">No history yet. Summaries you generate will appear here.</div>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map(it=> (
            <Card key={it.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-sm text-slate-500">{new Date(it.date).toLocaleString()}</div>
                  <p className="mt-2 text-sm">{it.summary.slice(0,200)}{it.summary.length>200?'...':''}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="btn btn-sm btn-outline" onClick={()=>navigator.clipboard.writeText(it.summary)}>Copy</button>
                  <button className="btn btn-sm btn-outline" onClick={()=>remove(it.id)}>Delete</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
