'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { verifyCsrfToken } from '@/utils/csrf'

export async function login(formData: FormData) {
  // Get and verify CSRF token
  const csrfToken = formData.get('csrfToken') as string;
  const isValidCsrf = await verifyCsrfToken(csrfToken);
  
  if (!isValidCsrf) {
    console.error('CSRF validation failed');
    redirect('/auth/error?message=invalid_request');
  }

  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error.message);
    redirect('/auth/error');
  }

  revalidatePath('/', 'layout')
  redirect('/secure/dashboard')
}