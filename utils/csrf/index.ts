import { cookies } from 'next/headers';
import crypto from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_FORM_FIELD = 'csrfToken';

/**
 * Generate a CSRF token
 * @returns A new CSRF token
 */
export async function generateCsrfToken(): Promise<string> {
  // Create a random buffer
  const randomBuffer = crypto.randomBytes(32);
  
  // Create a timestamp buffer (to make token time-bound)
  const timestamp = Date.now().toString();
  const timestampBuffer = Buffer.from(timestamp);
  
  // Combine the random and timestamp buffers
  const dataBuffer = Buffer.concat([randomBuffer, timestampBuffer]);
  
  // Create an HMAC with our secret
  const hmac = crypto.createHmac('sha256', CSRF_SECRET);
  hmac.update(dataBuffer);
  
  // Get the digest as hex
  const token = hmac.digest('hex');
  
  const cookieStore = cookies();
  
  // Store the token in a cookie
  cookieStore.set({
    name: CSRF_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // 1 hour
  });
  
  return token;
}

/**
 * Verify that a CSRF token is valid
 * @param token The token to verify
 * @returns Boolean indicating whether the token is valid
 */
export async function verifyCsrfToken(token: string): Promise<boolean> {
  if (!token) return false;
  
  const cookieStore = cookies();
  const storedToken = cookieStore.get(CSRF_COOKIE_NAME);
  
  if (!storedToken) return false;
  
  // Simple constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(storedToken.value)
    );
  } catch (error) {
    console.error('CSRF token validation error:', error);
    return false;
  }
}

/**
 * Get CSRF form field info for inclusion in forms
 */
export async function getCsrfFormField() {
  const token = await generateCsrfToken();
  return {
    name: CSRF_FORM_FIELD,
    value: token
  };
}
