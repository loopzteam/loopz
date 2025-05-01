'use client'

import { Suspense } from 'react'
import LoopContent from './LoopContent'

export default function LoopDetail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <LoopContent />
    </Suspense>
  )
}