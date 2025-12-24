import { createBrowserClient } from '@supabase/ssr'

//Initializing the Supabase client for client-side use
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )