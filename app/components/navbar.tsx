import React from 'react';
import Link from 'next/link';

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
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f8f8f8',
      borderBottom: '1px solid #ccc'
    }}>
      {/* App Name on the left */}
      <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
        {appName}
      </Link>

      {/* Navigation items on the right */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/secure/dashboard" style={{ margin: '0 1rem', textDecoration: 'none', color: 'inherit' }}>Dashboard</Link>
        <Link href="/secure/tasks" style={{ margin: '0 1rem', textDecoration: 'none', color: 'inherit' }}>Tasks</Link>
        {/* User avatar with initial */}
        <Link href="/secure/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {userInitial}
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
