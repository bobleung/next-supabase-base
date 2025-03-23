# Security Enhancements - Work In Progress

This document outlines security issues identified in the Next.js base project and recommendations for addressing them.

## Current Security Status

The application has a basic authentication and route protection mechanism using Supabase and Next.js middleware. While the foundation is solid, several important security measures are missing or incomplete.

## Security Issues to Address

### 1. Missing Input Validation ✅

**Issue:** Login and signup forms lack proper input validation.

**Risk:** Potential for injection attacks, malformed data, and security vulnerabilities.

**Solution:**
- ✅ Implemented frontend validation for immediate user feedback
- ✅ Added server-side validation in the auth action files using Zod

### 2. Missing Security Headers ⚠️

**Issue:** No explicit security headers configuration.

**Risk:** Various attacks including clickjacking, XSS, MIME-type sniffing, etc.

**Implementation Steps:**

1. **Create or Update Next.js Config File** ✅
   - Located existing `next.config.ts` file in the project root
   - Verified it has the proper export structure

2. **Define Basic Security Headers** ✅
   - Defined the initial set of non-CSP security headers:
     - X-DNS-Prefetch-Control
     - X-XSS-Protection
     - X-Frame-Options
     - X-Content-Type-Options
     - Referrer-Policy
   - Headers are defined but not yet applied (will be implemented in step 4)

3. **Implement Content Security Policy (CSP)** ✅
   - Added CSP header with the following directives:
     - default-src 'self': Restricts all resources to same origin by default
     - script-src 'self' 'unsafe-inline': Allows scripts from same origin and inline scripts
     - style-src 'self' 'unsafe-inline': Allows styles from same origin and inline styles
     - font-src 'self': Restricts fonts to same origin
     - img-src 'self' data:: Allows images from same origin and data URIs
     - connect-src 'self' https://*.supabase.co: Allows connections to same origin and Supabase
   - CSP is defined but not yet applied (will be implemented in step 4)

4. **Add Headers Configuration to Next.js Config** ✅
   - Implemented the `headers()` function in Next.js config
   - Configured it to apply security headers to all routes using the '/(.*)'
     source pattern
   - All previously defined headers will now be applied to responses

5. **Test Security Headers Implementation** ✅
   - ✅ Ran application locally
   - ✅ Used curl to verify headers are being applied
   - ✅ Confirmed all six security headers are present and correctly configured

6. **Document the Implementation** ✅
   - ✅ Created detailed documentation in docs/security/headers.md
   - ✅ Documented configuration decisions and trade-offs
   - ✅ Updated WIP.md to mark this task as completed

**Example Implementation:**

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

### 3. Logout Implementation ✅

**Issue:** ~~No visible logout functionality.~~ (RESOLVED)

**Risk:** ~~Sessions remaining active after users are done, especially on shared computers.~~ (MITIGATED)

**Solution:**
- ✅ Implemented proper logout function in `/app/secure/profile/actions.ts`
- ✅ Added logout button in profile page
- ✅ Implemented secure server-side session termination

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
   - ✅ Input Validation
   - ✅ Proper Logout Function
   - ✅ Security Headers

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
- ✅ Input Validation: Added comprehensive client and server-side validation using Zod
- ✅ Logout Functionality: Implemented secure logout with proper session termination
- ✅ Security Headers: Implemented all six essential security headers with balanced CSP configuration
