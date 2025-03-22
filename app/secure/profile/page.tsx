import { createClient } from '@/utils/supabase/server'
import ProfileClient from './profile-client'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  
  // Get the user's profile if user exists
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    profile = data
  }
  
  return <ProfileClient user={user} profile={profile} />
}
