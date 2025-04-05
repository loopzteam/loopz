import { createClient } from '@/lib/supabase/server'
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

export default async function LoopzDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: loop, error } = await supabase
    .from('loopz')
    .select('id, title, steps(id, title, completed)')
    .eq('id', params.id)
    .maybeSingle<Loopz>()

  if (error) {
    return <div className="p-8 text-red-500">Error loading loop: {error.message}</div>
  }

  if (!loop) {
    return <div className="p-8 text-muted-foreground">No loop found for ID {params.id}</div>
  }

  const steps = loop.steps || []
  const total = steps.length
  const completed = steps.filter((s) => s.completed).length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

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
                <input type="checkbox" disabled checked={!!step.completed} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}