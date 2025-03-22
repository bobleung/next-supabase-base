'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function logout() {
  const supabase = await createClient()
  
  // Sign out the user
  await supabase.auth.signOut()
  
  // Redirect to login page
  redirect('/auth/login')
}
