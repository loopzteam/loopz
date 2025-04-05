'use client'

import { useAuth } from '@/lib/auth-provider'

export function SignOutButton() {
  const { signOut } = useAuth()

  return (
    <button
      onClick={signOut}
      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
    >
      Sign Out
    </button>
  )
}