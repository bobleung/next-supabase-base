'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  // Sign up the user
  const { data: authData, error: signUpError } = await supabase.auth.signUp(data)

  if (signUpError) {
    redirect('/error')
  }

  // If signup was successful, create a profile for the user
  if (authData?.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      redirect('/error')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/secure/dashboard')
}
