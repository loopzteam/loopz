import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/db'

export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Singleton instance for client components
let clientInstance: ReturnType<typeof createSupabaseClient> | null = null

export const getClientSupabase = () => {
  if (!clientInstance) {
    clientInstance = createSupabaseClient()
  }
  return clientInstance
} 