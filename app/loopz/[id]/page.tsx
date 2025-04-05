'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Step {
  id: string
  title: string
  completed: boolean
}

interface Loopz {
  id: string
  title: string
  steps: Step[]
}

export default function LoopzDetailPage() {
  const params = useParams()
  const [loop, setLoop] = useState<Loopz | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLoop = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('loopz')
        .select('id, title, steps(id, title, completed)')
        .eq('id', params.id)
        .maybeSingle()
      if (error) console.error(error)
      else setLoop(data)
      setLoading(false)
    }

    fetchLoop()
  }, [params.id])

  if (loading) return <div className="p-6">Loading...</div>
  if (!loop) return <div className="p-6 text-red-500">Loop not found.</div>

  const steps = loop.steps || []
  const total = steps.length
  const completed = steps.filter((s) => s.completed).length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  const toggleStep = async (stepId: string, completed: boolean) => {
    await fetch(`/api/steps/${stepId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    })

    setLoop((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        steps: prev.steps.map((s) =>
          s.id === stepId ? { ...s, completed } : s
        ),
      }
    })
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{loop.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={percent} className="mb-2" />
          <p className="text-sm text-muted-foreground mb-4">{percent}% complete</p>

          <h3 className="text-lg font-semibold mb-2">Action Steps</h3>
          <ul className="space-y-3">
            {steps.map((step) => (
              <li key={step.id} className="flex items-center justify-between p-3 border rounded">
                <span className="text-sm">{step.title}</span>
                <input
                  type="checkbox"
                  checked={step.completed}
                  onChange={(e) => toggleStep(step.id, e.target.checked)}
                />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}