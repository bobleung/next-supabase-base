import React from 'react';
import Link from 'next/link';
import styles from './navbar.module.css';

interface User {
  first_name: string;
  last_name: string;
}

// Variables for the navbar
const appName: string = 'my app';
const user: User = {
  first_name: 'John',
  last_name: 'Doe'
};

const Navbar: React.FC = () => {
  // Extract user's initial from first_name and last_name
  const userInitial = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();

  return (
    <nav className={styles.navbar}>
      {/* App Name on the left */}
      <Link href="/" className={styles.appName}>
        {appName}
      </Link>

      {/* Navigation items on the right */}
      <div className={styles.navLinks}>
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
      </div>
    </nav>
  );
};

export default Navbar;
