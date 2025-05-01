'use client'

import { Suspense } from 'react'
import SignInContent from './SignInContent'

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}