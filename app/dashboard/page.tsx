import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from '@/components/auth/sign-out-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data } = await supabase
    .from('loopz')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  const loopz = data ?? []

  return (
    <div className="p-6 space-y-6 pb-36"> {/* padding bottom for input */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Loopz</h1>
        <div className="flex gap-4">
          <Link href="/" className="text-blue-500 hover:underline">
            ← Home
          </Link>
          <SignOutButton />
        </div>
      </div>

      {loopz.length === 0 ? (
        <div className="text-muted-foreground">No loopz yet. Start by creating one.</div>
      ) : (
        <ul className="space-y-3">
          {loopz.map((l) => (
            <li key={l.id} className="border p-3 rounded">
              <Link href={`/loopz/${l.id}`} className="text-blue-600 hover:underline">
                {l.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Input bar for new loopz */}
      <form
        action="/api/generatetasks"
        method="POST"
        className="fixed bottom-0 inset-x-0 p-4 bg-white border-t flex gap-2"
      >
        <textarea
          name="input"
          placeholder="Start typing your loop..."
          required
          className="flex-grow p-2 border rounded resize-none"
          rows={2}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </div>
  )
}