// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// 환경변수에서 URL, 키를 읽어서 연결 (이게 공식/권장 방식)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
