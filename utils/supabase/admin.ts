'use server'

import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client with admin privileges using the service role key.
 * This should ONLY be used on the server side for operations that require 
 * elevated permissions, such as deleting users.
 */
export async function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing environment variables for Supabase admin client')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
