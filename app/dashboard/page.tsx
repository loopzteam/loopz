import Link from 'next/link'

export default function Dashboard() {
  // Mock data for loops
  const loops = [
    {
      id: '1',
      title: 'Plan vacation to Japan',
      progress: 25,
      totalSteps: 8,
      completedSteps: 2,
    },
    {
      id: '2',
      title: 'Learn TypeScript',
      progress: 60,
      totalSteps: 5,
      completedSteps: 3,
    },
    {
      id: '3',
      title: 'Redesign personal website',
      progress: 10,
      totalSteps: 10,
      completedSteps: 1,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">Loopz Dashboard</h1>
            <Link 
              href="/"
              className="text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loops.map(loop => (
            <Link 
              key={loop.id} 
              href={`/loop?id=${loop.id}`}
              className="block"
            >
              <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-medium mb-2">{loop.title}</h2>
                
                <div className="mt-4 mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-black h-2.5 rounded-full" 
                      style={{ width: `${loop.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  {loop.completedSteps} of {loop.totalSteps} tasks completed
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}