'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/features/auth/auth-provider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SignUpPage() {
  const { signUp, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signUp(email, password)
    if (!error) {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-8 px-4 py-8 sm:px-6 md:mt-0">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Loopz</h1>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Check your email
            </h2>
          </div>
          <div className="mt-2 text-center text-sm text-gray-600">
            <p>We&apos;ve sent you a confirmation email. Please check your inbox and follow the link to verify your account.</p>
            <div className="mt-6">
              <Link href="/auth/sign-in" className="font-medium text-black hover:underline">
                Return to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4 py-8 sm:px-6 md:mt-0">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Loopz</h1>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Create an account
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password (min 6 characters)"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Sign up
            </Button>
          </div>

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="font-medium text-black hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 