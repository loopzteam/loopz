import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  const buttonHref = session ? '/dashboard' : '/login'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="text-center p-8 max-w-xl">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Untangle Your Mind
        </h1>
        <p className="mb-8 text-gray-600 text-lg">
          Loopz is your space to slow down, process your thoughts, and take meaningful steps forward — one loop at a time.
        </p>
        <a
          href={buttonHref}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition text-lg"
        >
          Untangle Your Mind →
        </a>
      </div>
    </div>
  )
}