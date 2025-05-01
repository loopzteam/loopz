export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      loops: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          progress: number | null
          total_steps: number | null
          completed_steps: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          progress?: number | null
          total_steps?: number | null
          completed_steps?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          progress?: number | null
          total_steps?: number | null
          completed_steps?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          loop_id: string
          user_id: string
          title: string
          is_completed: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          loop_id: string
          user_id: string
          title: string
          is_completed?: boolean
          position: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          loop_id?: string
          user_id?: string
          title?: string
          is_completed?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      microsteps: {
        Row: {
          id: string
          task_id: string
          user_id: string
          title: string
          is_completed: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          title: string
          is_completed?: boolean
          position: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          title?: string
          is_completed?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          loop_id: string | null
          user_id: string
          role: string
          phase: string | null
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          loop_id?: string | null
          user_id: string
          role: string
          phase?: string | null
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          loop_id?: string | null
          user_id?: string
          role?: string
          phase?: string | null
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 