import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: loopz, error } = await supabase.from('loopz').select('*')

  if (error) return <div>Supabase connection failed: {error.message}</div>

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Loopz fetched from Supabase:</h1>
      <pre>{JSON.stringify(loopz, null, 2)}</pre>
    </div>
  )
}