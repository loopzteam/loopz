import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-black mb-6">Loopz</h1>
        <p className="text-xl text-gray-700 mb-8">
          Organize your tasks and get more done with AI assistance.
        </p>
        <div className="space-y-4">
          <Link 
            href="/dashboard"
            className="block w-full bg-black text-white rounded-md py-3 font-medium hover:bg-gray-800 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
