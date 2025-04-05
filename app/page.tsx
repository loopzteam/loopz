'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-provider'
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const { user, loading: authLoading } = useAuth()
  const [loopz, setLoopz] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLoopz = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from('loopz').select('*').limit(5)
      if (error) {
        console.error('Error fetching loopz:', error)
      } else {
        setLoopz(data || [])
      }
      setLoading(false)
    }

    fetchLoopz()
  }, [])

  if (authLoading || loading) return <div className="p-4">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Loopz Home</h1>

      {user ? (
        <p className="text-green-600 mb-4">✅ Logged in as {user.email}</p>
      ) : (
        <p className="text-gray-500 mb-4">Not logged in</p>
      )}

      <h2 className="text-xl font-semibold mb-2">Recent Loopz</h2>
      {loopz.length === 0 ? (
        <p className="text-muted-foreground">No loopz found.</p>
      ) : (
        <ul className="space-y-2">
          {loopz.map((loop: any) => (
            <li key={loop.id} className="border p-3 rounded">
              {loop.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}