'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-provider'
import Link from 'next/link'

export default function SignupPage() {
  const { signUp } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (password !== confirm) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for a confirmation link.')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {message && <div className="text-green-600 mb-4">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          required
          className="w-full p-2 border rounded"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
