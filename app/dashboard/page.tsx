import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to your dashboard</h1>
      <p className="text-muted-foreground mt-2">
        You’re successfully authenticated. 🎉
      </p>
    </div>
  )
}