'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from './actions'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

// Define the Profile type
type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  website: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export default function ProfileClient({ 
  user, 
  profile 
}: { 
  user: User | null, 
  profile: Profile | null 
}) {
  const router = useRouter()
  const supabase = createClient()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState(profile?.first_name || '')
  const [lastName, setLastName] = useState(profile?.last_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      router.refresh()
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setIsLoading(false)
    }
  }

  const updateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
      })

      if (error) throw error
      setMessage({ 
        type: 'success', 
        text: 'Email update initiated. Please check your email to confirm the change.' 
      })
    } catch (error) {
      console.error('Error updating email:', error)
      setMessage({ type: 'error', text: 'Failed to update email' })
    } finally {
      setIsLoading(false)
    }
  }

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword) {
      setMessage({ type: 'error', text: 'Both current and new password are required' })
      return
    }
    
    // Validate password length
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' })
      return
    }
    
    setIsLoading(true)
    setMessage(null)

    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      })

      if (signInError) {
        setMessage({ type: 'error', text: 'Current password is incorrect' })
        setIsLoading(false)
        return
      }

      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      
      setMessage({ type: 'success', text: 'Password updated successfully' })
      setCurrentPassword('')
      setNewPassword('')
    } catch (error) {
      console.error('Error updating password:', error)
      setMessage({ type: 'error', text: 'Failed to update password' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-card-header">Profile</h1>
        
        {message && (
          <div className={message.type === 'success' ? 'auth-message-success' : 'auth-message-error'}>
            {message.text}
          </div>
        )}
        
        {user && (
          <div className="space-y-6">
            <div className="auth-section">
              <h2 className="auth-section-header">Profile Information</h2>
              <form onSubmit={updateProfile} className="auth-form">
                <div className="auth-form-group">
                  <label htmlFor="firstName" className="auth-label">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>
                <div className="auth-form-group">
                  <label htmlFor="lastName" className="auth-label">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={isLoading ? 'auth-button-primary auth-button-disabled' : 'auth-button-primary'}
                >
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
            
            <div className="auth-section">
              <h2 className="auth-section-header">Email Address</h2>
              <form onSubmit={updateEmail} className="auth-form">
                <div className="auth-form-group">
                  <label htmlFor="email" className="auth-label">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={isLoading ? 'auth-button-primary auth-button-disabled' : 'auth-button-primary'}
                >
                  {isLoading ? 'Updating...' : 'Update Email'}
                </button>
              </form>
            </div>
            
            <div className="auth-section">
              <h2 className="auth-section-header">Change Password</h2>
              <form onSubmit={updatePassword} className="auth-form">
                <div className="auth-form-group">
                  <label htmlFor="currentPassword" className="auth-label">Current Password</label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>
                <div className="auth-form-group">
                  <label htmlFor="newPassword" className="auth-label">New Password</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="auth-input"
                    required
                  />
                  <p className="auth-help-text">Password must be at least 6 characters long</p>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={isLoading ? 'auth-button-primary auth-button-disabled' : 'auth-button-primary'}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
            
            <form action={logout}>
              <button 
                type="submit"
                className="auth-button-danger"
              >
                Log Out
              </button>
            </form>
          </div>
        )}
        
        {!user && (
          <div className="text-center">
            <p className="text-gray-600">You need to be logged in to view your profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}
