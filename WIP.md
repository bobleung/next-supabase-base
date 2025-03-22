# Security Enhancements - Work In Progress

This document outlines security issues identified in the Next.js base project and recommendations for addressing them.

## Current Security Status

The application has a basic authentication and route protection mechanism using Supabase and Next.js middleware. While the foundation is solid, several important security measures are missing or incomplete.

## Security Issues to Address

### 1. Missing Input Validation ⚠️

**Issue:** Login and signup forms lack proper input validation.

**Risk:** Potential for injection attacks, malformed data, and security vulnerabilities.

**Solution:**
- Implement frontend validation for immediate user feedback
- Add server-side validation in the auth action files:

```typescript
// Example implementation for login/actions.ts
import { z } from 'zod'; // Consider adding zod for validation

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export async function login(formData: FormData) {
  const supabase = await createClient();
  
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };
  
  // Validate the data
  try {
    const validatedData = loginSchema.parse(rawData);
  } catch (error) {
    // Handle validation errors
    return { error: "Invalid input data" };
  }
  
  // Proceed with authentication...
}
```

### 2. Missing Security Headers ⚠️

**Issue:** No explicit security headers configuration.

**Risk:** Various attacks including clickjacking, XSS, MIME-type sniffing, etc.

**Solution:**
- Add security headers in Next.js config:

```typescript
// In next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 3. Incomplete Logout Implementation ⚠️

**Issue:** No visible logout functionality.

**Risk:** Sessions remaining active after users are done, especially on shared computers.

**Solution:**
- Implement a proper logout function:

```typescript
// In a new file: app/auth/logout/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
```

- Add a logout button to the navbar:

```typescript
// In navbar.tsx
import { logout } from '@/app/auth/logout/actions'

// Inside the authenticated user section of navbar
<form action={logout}>
  <button type="submit" className={styles.navLink}>
    Logout
  </button>
</form>
```

### 4. Basic Error Handling ⚠️

**Issue:** Generic error handling that redirects to `/error`.

**Risk:** Poor user experience and potential security information disclosure.

**Solution:**
- Create more specific error handling:

```typescript
// Create an error handling utility
// utils/error-handling.ts
export function handleAuthError(error: any) {
  console.error('Auth error:', error)
  
  if (error.message.includes('Email not confirmed')) {
    return { error: 'Please verify your email address' }
  }
  
  if (error.message.includes('Invalid login credentials')) {
    return { error: 'Invalid email or password' }
  }
  
  // Generic error message for other cases
  return { error: 'Authentication failed. Please try again.' }
}

// In login action
if (error) {
  return handleAuthError(error)
}
```

### 5. Password Policy ⚠️

**Issue:** No enforcement of password strength.

**Risk:** Weak passwords that are vulnerable to dictionary attacks and brute forcing.

**Solution:**
- Add password strength requirements in validation:

```typescript
// Add to input validation
const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});
```

### 6. Rate Limiting ⚠️

**Issue:** No protection against brute force attacks.

**Risk:** Vulnerability to password guessing and denial of service attacks.

**Solution:**
- Implement API rate limiting for authentication endpoints
- Consider using a middleware solution like `express-rate-limit` if using API routes
- For server actions, implement a custom rate limiting solution:

```typescript
// utils/rate-limit.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
})

export async function rateLimit(ip: string, action: string, limit = 5, window = 60) {
  const key = `rate-limit:${action}:${ip}`
  const current = await redis.get(key) as number || 0
  
  if (current >= limit) {
    return false
  }
  
  await redis.incr(key)
  await redis.expire(key, window)
  
  return true
}

// In login action
const ip = request.headers.get('x-forwarded-for') || 'unknown'
const canProceed = await rateLimit(ip, 'login', 5, 60)

if (!canProceed) {
  return { error: 'Too many attempts. Please try again later.' }
}
```

### 7. Session Management ⚠️

**Issue:** No explicit session timeout or forced re-authentication for sensitive operations.

**Risk:** Prolonged sessions could be hijacked or abused.

**Solution:**
- Set session timeouts in Supabase configuration
- Implement re-authentication for sensitive operations:

```typescript
// For sensitive operations like changing password
export async function requireReauthentication() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  // Check time since last authentication
  const lastAuth = new Date(session?.created_at || 0)
  const timeSinceAuth = Date.now() - lastAuth.getTime()
  
  if (timeSinceAuth > 30 * 60 * 1000) { // 30 minutes
    // Redirect to reauthentication page
    redirect('/auth/confirm-password')
  }
}
```

## Implementation Priority

1. **Critical (Implement First)**
   - ⚠️ Input Validation
   - ⚠️ Proper Logout Function
   - ⚠️ Security Headers

2. **High Priority**
   - ⚠️ Better Error Handling
   - ⚠️ Password Policy

3. **Medium Priority**
   - ⚠️ Rate Limiting
   - ⚠️ Session Management

## Next Steps

1. Implement the critical security measures first
2. Add automated security testing
3. Consider regular security audits
4. Document security practices for future contributors

## Completed Security Enhancements
- ✅ CSRF Protection: Using Next.js Server Actions and Supabase's built-in protection
