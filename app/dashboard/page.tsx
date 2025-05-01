'use client'

import Link from 'next/link'
// import { useRouter } from 'next/navigation' - will add back if needed
import { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/auth-provider'
import { Button } from '@/components/ui/Button'
import { useLoopsStore } from '@/features/loops/use-loops-store'

export default function Dashboard() {
  // router not needed now, but may be useful if we add navigation
  const { user, signOut } = useAuth()
  const { loops, isLoading, error, fetchLoops } = useLoopsStore()
  const [isSigningOut, setIsSigningOut] = useState(false)
  
  useEffect(() => {
    // Fetch loops when component mounts
    fetchLoops()
  }, [fetchLoops])
  
  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      // Redirect handled in the auth provider
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">Loopz Dashboard</h1>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-600">{user.email}</span>
              )}
              <Button 
                variant="ghost"
                onClick={handleSignOut}
                isLoading={isSigningOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
            <p>{error}</p>
            <Button 
              onClick={() => fetchLoops()} 
              className="mt-2"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        ) : loops.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No loops yet</h2>
            <p className="text-gray-600 mb-6">Create your first loop to get started</p>
            <Button>Create a Loop</Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loops.map(loop => (
              <Link 
                key={loop.id} 
                href={`/loop?id=${loop.id}`}
                className="block"
              >
                <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h2 className="text-lg font-medium mb-2">{loop.title}</h2>
                  {loop.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{loop.description}</p>
                  )}
                  
                  <div className="mt-4 mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-black h-2.5 rounded-full" 
                        style={{ width: `${loop.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {loop.completed_steps || 0} of {loop.total_steps || 0} tasks completed
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}