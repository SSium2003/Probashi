'use client'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [result, setResult] = useState<any>(null)
  const [error, setError]   = useState<string|null>(null)

  useEffect(() => {
    fetch('/api/hello')
      .then(res => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then(json => setResult(json))
      .catch(err => setError(err.message))
  }, [])

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>
  if (!result) return <div className="p-4">Loading…</div>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Connection Test</h1>
      <pre className="bg-gray-100 p-2 rounded">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}
