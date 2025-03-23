# Security Headers Implementation

This document outlines the security headers implemented in the Next.js base project to protect against common web vulnerabilities.

## Overview

Security headers are HTTP response headers that help to enhance the security of web applications by enabling browser security features. These headers are essential for protecting against attacks such as cross-site scripting (XSS), clickjacking, MIME type sniffing, and other common web vulnerabilities.

## Implemented Headers

The following security headers have been implemented in the project:

### 1. X-DNS-Prefetch-Control: on

- **Purpose**: Controls DNS prefetching, where browsers proactively perform domain name resolution on links.
- **Benefits**: Improves performance for external links.
- **Security Implications**: When enabled, it can leak which domains users are visiting.

### 2. X-XSS-Protection: 1; mode=block

- **Purpose**: Enables the browser's built-in XSS filter.
- **Benefits**: Provides an additional layer of protection against reflected cross-site scripting attacks.
- **Security Implications**: While modern browsers rely more on Content Security Policy, this header provides backwards compatibility for older browsers.

### 3. X-Frame-Options: SAMEORIGIN

- **Purpose**: Controls whether a page can be embedded in an iframe, frame, or object.
- **Benefits**: Prevents clickjacking attacks by ensuring the page can only be framed by pages from the same origin.
- **Security Implications**: Restricts legitimate framing to same-origin contexts only.

### 4. X-Content-Type-Options: nosniff

- **Purpose**: Prevents browsers from interpreting files as a different MIME type than what is specified in the Content-Type header.
- **Benefits**: Prevents MIME type sniffing attacks.
- **Security Implications**: Scripts and stylesheets must have correct Content-Type headers.

### 5. Referrer-Policy: strict-origin-when-cross-origin

- **Purpose**: Controls how much referrer information should be included with requests.
- **Benefits**: Preserves origin information while protecting path and query information from being leaked to other origins.
- **Security Implications**: Balanced approach that maintains referrer data for same-origin requests but limits it for cross-origin requests.

### 6. Content-Security-Policy

A comprehensive Content Security Policy has been implemented to control which resources the browser is allowed to load:

```
default-src 'self'; 
script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com; 
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; 
font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:; 
img-src 'self' data: https://images.unsplash.com https://*.cloudinary.com https://cdn.jsdelivr.net; 
connect-src 'self' https://*.supabase.co https://api.mapbox.com wss://*.supabase.co;
```

- **Purpose**: Defines approved sources of content that the browser can load.
- **Benefits**: Mitigates XSS attacks by restricting which scripts can be executed and which resources can be loaded.
- **Security Implications**: Requires careful configuration to ensure legitimate resources are allowed while maintaining security.

#### CSP Directives Explained

- **default-src 'self'**: Only allow resources from the same origin by default
- **script-src**: Controls which scripts can be loaded
  - Allows scripts from the application's origin
  - Allows inline scripts (needed for many frameworks)
  - Allows scripts from trusted CDNs
- **style-src**: Controls which stylesheets can be loaded
  - Allows styles from the application's origin
  - Allows inline styles
  - Allows styles from Google Fonts and trusted CDNs
- **font-src**: Controls which fonts can be loaded
  - Allows fonts from the application's origin
  - Allows fonts from Google Fonts and trusted CDNs
  - Allows data URI fonts
- **img-src**: Controls which images can be loaded
  - Allows images from the application's origin
  - Allows data URI images
  - Allows images from common services like Unsplash and Cloudinary
- **connect-src**: Controls which locations can be loaded using fetch, WebSocket, etc.
  - Allows connections to the application's origin
  - Allows connections to Supabase (both HTTPS and WebSocket)
  - Allows connections to MapBox API

## Implementation

The security headers are implemented in the `next.config.ts` file using Next.js's `headers()` function:

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
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:; img-src 'self' data: https://images.unsplash.com https://*.cloudinary.com https://cdn.jsdelivr.net; connect-src 'self' https://*.supabase.co https://api.mapbox.com wss://*.supabase.co;",
  }
];

const nextConfig = {
  // Other config options here
  
  // Add headers configuration
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

## CSP Configuration Decisions

The Content Security Policy has been configured to balance security with practical development needs:

1. **Default Restrictive Policy**: Uses 'self' as the default source directive to implement the principle of least privilege.

2. **Necessary Exceptions**: Includes trusted external sources that are commonly needed in modern web applications:
   - CDNs for JavaScript libraries and framework dependencies
   - Google Fonts for typography
   - Image services for content
   - API endpoints for functionality

3. **Development and Production Consistency**: The same CSP is used in both development and production to ensure that issues are caught early.

4. **Inline Scripts and Styles**: 'unsafe-inline' is included because many modern JavaScript frameworks (including Next.js) rely on inline scripts and styles. In a future enhancement, nonces or hashes could be implemented to further improve security.

## Testing

Security headers can be tested using the following methods:

1. **Command Line**: 
   ```bash
   curl -I http://localhost:3000
   ```

2. **Browser Developer Tools**: 
   - Open the Network tab
   - Select a request
   - View the Response Headers section

3. **Online Security Headers Testing Tools**:
   - [SecurityHeaders.com](https://securityheaders.com)
   - [Observatory by Mozilla](https://observatory.mozilla.org)

## Future Enhancements

1. **Replace 'unsafe-inline' with Nonces or Hashes**: Improve CSP by using nonces or hashes instead of 'unsafe-inline' for scripts and styles.

2. **Implement Feature-Policy/Permissions-Policy**: Add headers to control which browser features can be used.

3. **Add Strict-Transport-Security**: Implement HSTS for production environments using HTTPS.

4. **Regular Auditing**: Periodically review and update security headers to address new vulnerabilities and browser features.

5. **CSP Reporting**: Implement reporting endpoints to monitor CSP violations.

## References

- [MDN Web Docs: HTTP security headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [Next.js Documentation: Headers](https://nextjs.org/docs/api-reference/next.config.js/headers)
