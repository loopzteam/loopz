'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoopContent() {
  const searchParams = useSearchParams()
  const loopId = searchParams.get('id')
  
  // Mock data based on loop ID
  const getTasks = (id: string) => {
    if (id === '1') {
      return [
        { id: '101', title: 'Research best time to visit Japan', isCompleted: true },
        { id: '102', title: 'Create budget for the trip', isCompleted: true },
        { id: '103', title: 'Research transportation options', isCompleted: false },
        { id: '104', title: 'Book flights', isCompleted: false },
        { id: '105', title: 'Research accommodations', isCompleted: false },
        { id: '106', title: 'Book accommodations', isCompleted: false },
        { id: '107', title: 'Create itinerary', isCompleted: false },
        { id: '108', title: 'Pack for the trip', isCompleted: false },
      ]
    } else if (id === '2') {
      return [
        { id: '201', title: 'Complete TypeScript basics tutorial', isCompleted: true },
        { id: '202', title: 'Learn about TypeScript interfaces and types', isCompleted: true },
        { id: '203', title: 'Practice with generics and utility types', isCompleted: true },
        { id: '204', title: 'Build a small project with TypeScript', isCompleted: false },
        { id: '205', title: 'Learn TypeScript with React', isCompleted: false },
      ]
    } else {
      return [
        { id: '301', title: 'Analyze current website strengths and weaknesses', isCompleted: true },
        { id: '302', title: 'Research design trends for personal websites', isCompleted: false },
        { id: '303', title: 'Create wireframes for new design', isCompleted: false },
        { id: '304', title: 'Decide on technology stack', isCompleted: false },
        { id: '305', title: 'Design visual style (colors, typography, etc.)', isCompleted: false },
        { id: '306', title: 'Create high-fidelity mockups', isCompleted: false },
        { id: '307', title: 'Set up development environment', isCompleted: false },
        { id: '308', title: 'Implement new design', isCompleted: false },
        { id: '309', title: 'Optimize for performance and accessibility', isCompleted: false },
        { id: '310', title: 'Launch new website', isCompleted: false },
      ]
    }
  }
  
  const getLoopTitle = (id: string) => {
    return id === '1' 
      ? 'Plan vacation to Japan'
      : id === '2'
      ? 'Learn TypeScript'
      : id === '3'
      ? 'Redesign personal website'
      : 'Unknown Loop'
  }
  
  const tasks = loopId ? getTasks(loopId) : []
  const loopTitle = loopId ? getLoopTitle(loopId) : 'Unknown Loop'
  
  // Calculate progress
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.isCompleted).length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link 
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 mr-3"
              >
                ← Back
              </Link>
              <h1 className="text-xl font-semibold">{loopTitle}</h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Progress</h2>
          
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-black h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {completedTasks} of {totalTasks} tasks completed ({progress}%)
          </div>
        </div>
        
        {/* Tasks section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Tasks</h2>
          
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  task.isCompleted ? 'border-black bg-black' : 'border-gray-400'
                }`}>
                  {task.isCompleted && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className={`ml-3 ${task.isCompleted ? 'text-gray-500 line-through' : ''}`}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}