'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function logout() {
  const supabase = await createClient()
  
  // Sign out the user
  await supabase.auth.signOut()
  
  // Redirect to login page
  redirect('/auth/login')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }
  
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  
  // Update the profile in the database
  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: firstName,
      last_name: lastName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
  
  if (error) {
    console.error('Error updating profile:', error)
    return { error: 'Failed to update profile' }
  }
  
  // Revalidate the profile page to show updated data
  revalidatePath('/secure/profile')
  
  return { success: true }
}

export async function updateEmail(formData: FormData) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }
  
  const email = formData.get('email') as string
  
  // Update the user's email
  const { error } = await supabase.auth.updateUser({
    email: email,
  })
  
  if (error) {
    console.error('Error updating email:', error)
    return { error: 'Failed to update email' }
  }
  
  // Revalidate the profile page to show updated data
  revalidatePath('/secure/profile')
  
  return { success: true, message: 'Email update initiated. Please check your email to confirm the change.' }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }
  
  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  
  // First verify the current password by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  })
  
  if (signInError) {
    console.error('Error verifying current password:', signInError)
    return { error: 'Current password is incorrect' }
  }
  
  // Update the password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  
  if (error) {
    console.error('Error updating password:', error)
    return { error: 'Failed to update password' }
  }
  
  // Revalidate the profile page
  revalidatePath('/secure/profile')
  
  return { success: true, message: 'Password updated successfully' }
}
