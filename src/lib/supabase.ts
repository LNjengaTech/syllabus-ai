import { createBrowserClient } from '@supabase/ssr'

//initializing the Supabase client for client-side use

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);

export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  )