// types/supabase.ts
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
      loopz: {
        Row: {
          id: string
          title: string
          content: string | null
          created_at: string
          updated_at: string
          user_id: string
          is_public: boolean
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
          is_public?: boolean
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
          is_public?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "loopz_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          last_sign_in_at: string | null
          raw_user_meta_data: Json | null
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}