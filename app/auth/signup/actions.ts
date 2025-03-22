'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { signupSchema, validateFormData } from '@/utils/validation/auth'

export type SignupActionResult = {
  success: boolean;
  errors?: Record<string, string> | null;
  message?: string;
}

export async function signup(formData: FormData): Promise<SignupActionResult> {
  const supabase = await createClient()

  // Extract form data
  const rawFormData = {
    email: formData.get('email'),
    password: formData.get('password'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
  }

  // Validate input data
  const { data, errors } = validateFormData(signupSchema, rawFormData)
  
  // If validation fails, return errors
  if (errors) {
    return {
      success: false,
      errors,
    }
  }

  // Proceed with authentication using validated data
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: data!.email,
    password: data!.password,
  })

  // Handle authentication errors
  if (signUpError) {
    console.error('Signup error:', signUpError.message)
    
    // Map Supabase auth errors to user-friendly messages
    let errorMessage = 'Registration failed. Please try again.';
    
    if (signUpError.message.includes('already registered')) {
      errorMessage = 'This email is already registered';
    } else if (signUpError.message.includes('password')) {
      errorMessage = 'Password is invalid or too weak';
    }
    
    return {
      success: false,
      errors: { _form: errorMessage },
    }
  }

  // If signup was successful, create a profile for the user
  if (authData?.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        first_name: data!.firstName,
        last_name: data!.lastName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      
      return {
        success: false,
        errors: { _form: 'Account created but profile setup failed. Please contact support.' },
      }
    }
  }

  // Success: Update cache and redirect
  revalidatePath('/', 'layout')
  redirect('/secure/dashboard')
  
  // This return statement is only reached during testing
  // because the redirect will end the function execution in production
  return { 
    success: true,
    message: 'Account created successfully' 
  }
}