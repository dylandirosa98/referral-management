'use client'

import { useState } from 'react'

export default function TestPage() {
  const [results, setResults] = useState<any[]>([])

  const addResult = (result: any) => {
    setResults(prev => [result, ...prev])
  }

  const testDatabase = async () => {
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      addResult({
        type: 'Database Test',
        status: response.ok ? 'SUCCESS' : 'ERROR',
        data
      })
    } catch (error) {
      addResult({
        type: 'Database Test',
        status: 'ERROR',
        data: { error: (error as Error).message }
      })
    }
  }

  const testPartnerCreation = async () => {
    try {
      const response = await fetch('/api/test-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: 'Test Solar Co',
          contactName: 'John Test',
          email: `test-${Date.now()}@example.com`
        })
      })
      const data = await response.json()
      addResult({
        type: 'Partner Creation Test',
        status: response.ok ? 'SUCCESS' : 'ERROR',
        data
      })
    } catch (error) {
      addResult({
        type: 'Partner Creation Test',
        status: 'ERROR',
        data: { error: (error as Error).message }
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database & Partner Creation Tests</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testDatabase}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
          >
            Test Database Connection
          </button>
          
          <button
            onClick={testPartnerCreation}
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 ml-4"
          >
            Test Partner Creation
          </button>
          
          <button
            onClick={() => setResults([])}
            className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 ml-4"
          >
            Clear Results
          </button>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded border ${
                result.status === 'SUCCESS' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{result.type}</span>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    result.status === 'SUCCESS'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {result.status}
                </span>
              </div>
              <pre className="text-sm bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 