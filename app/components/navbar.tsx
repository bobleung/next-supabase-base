import React from 'react';
import Link from 'next/link';
import styles from './navbar.module.css';
import { createClient } from '@/utils/supabase/server';

// Define the Profile type
type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  website: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

// Variables for the navbar
const appName: string = 'my app';

const Navbar = async () => {
  // Get Supabase client
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile: Profile | null = null;
  let userInitial = '';
  
  // Get the user's profile if user exists
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    profile = data;
    
    // Generate user initials from first_name and last_name
    if (profile && profile.first_name && profile.last_name) {
      userInitial = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    } else {
      // Fallback if profile data is incomplete
      userInitial = user.email?.charAt(0).toUpperCase() || '?';
    }
  }

  return (
    <nav className={styles.navbar}>
      {/* App Name on the left */}
      <Link href="/" className={styles.appName}>
        {appName}
      </Link>

      {/* Navigation items on the right - only shown when user is logged in */}
      <div className={styles.navLinks}>
        {user ? (
          <>
            <Link href="/secure/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
            <Link href="/secure/tasks" className={styles.navLink}>
              Tasks
            </Link>
            {/* User avatar with initial */}
            <Link href="/secure/profile" className={styles.avatar}>
              {userInitial}
            </Link>
          </>
        ) : (
          <Link href="/auth/login" className={styles.navLink}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
