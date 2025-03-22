'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { loginSchema, validateFormData } from '@/utils/validation/auth'

export type LoginActionResult = {
  success: boolean;
  errors?: Record<string, string> | null;
  message?: string;
}

export async function login(formData: FormData): Promise<LoginActionResult> {
  const supabase = await createClient()

  // Extract form data
  const rawFormData = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  // Validate input data
  const { data, errors } = validateFormData(loginSchema, rawFormData)
  
  // If validation fails, return errors
  if (errors) {
    return {
      success: false,
      errors,
    }
  }

  // Proceed with authentication using validated data
  const { error } = await supabase.auth.signInWithPassword({
    email: data!.email,
    password: data!.password,
  })

  // Handle authentication errors
  if (error) {
    console.error('Login error:', error.message)
    
    // Map Supabase auth errors to user-friendly messages
    let errorMessage = 'Authentication failed. Please try again.';
    
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = 'Invalid email or password';
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = 'Please verify your email address';
    }
    
    return {
      success: false,
      errors: { _form: errorMessage },
    }
  }

  // Success: Update cache and redirect
  revalidatePath('/', 'layout')
  redirect('/secure/dashboard')
  
  // This return statement is only reached during testing
  // because the redirect will end the function execution in production
  return { success: true }
}