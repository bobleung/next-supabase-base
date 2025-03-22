'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

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

export async function deleteAccount(formData: FormData) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }
  
  const password = formData.get('password') as string
  const confirmationText = formData.get('confirmation-text') as string
  
  // Verify confirmation text
  if (confirmationText !== 'DELETE MY ACCOUNT') {
    return { error: 'Confirmation text does not match "DELETE MY ACCOUNT"' }
  }
  
  // Verify password and re-authenticate user
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: password,
  })
  
  if (authError) {
    console.error('Error verifying password:', authError)
    return { error: 'Password verification failed' }
  }
  
  try {
    // Create an admin client for privileged operations
    const adminSupabase = await createAdminClient()
    
    // Delete profile data first
    const { error: profileError } = await adminSupabase
      .from('profiles')
      .delete()
      .eq('id', user.id)
    
    if (profileError) {
      console.error('Error deleting profile:', profileError)
      return { error: 'Failed to delete profile data' }
    }
    
    // Delete user account using the Admin API
    const { error: userDeleteError } = await adminSupabase.auth.admin.deleteUser(
      user.id
    )
    
    if (userDeleteError) {
      console.error('Error deleting user account:', userDeleteError)
      return { error: 'Failed to delete account' }
    }
    
    // Sign out the user
    await supabase.auth.signOut()
    
    // Redirect to home page
    redirect('/')
    
  } catch (error) {
    console.error('Error in account deletion process:', error)
    return { error: 'An unexpected error occurred during account deletion' }
  }
}
