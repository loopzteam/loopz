'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User, AuthResponse } from '@supabase/supabase-js'
import { getClientSupabase } from '@/lib/supabase/client'

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<AuthResponse['data']>
  signUp: (email: string, password: string) => Promise<AuthResponse['data']>
  signOut: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getClientSupabase()

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        setSession(data.session)
        setUser(data.session?.user ?? null)
      } catch (error) {
        console.error('Error loading session:', error)
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      if (error) throw error
      
      // Update user and session state
      setSession(data.session)
      setUser(data.user)
      
      return data
    } catch (error) {
      console.error('Error signing in:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred during sign in'
      
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback',
        }
      })
      
      if (error) throw error
      
      // Check if confirmation email was sent or if auto-confirmed
      if (data.user?.identities?.length === 0) {
        throw new Error('Email address is already registered')
      }
      
      return data
    } catch (error) {
      console.error('Error signing up:', error)
      let errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred during sign up'
        
      // Provide more user-friendly error messages
      if (errorMessage.includes('email already')) {
        errorMessage = 'This email is already registered. Please sign in instead.'
      }
      
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear user state
      setUser(null)
      setSession(null)
      
      // Redirect to home page or sign-in page after sign out
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred during sign out'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      signIn,
      signUp,
      signOut,
      error
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 