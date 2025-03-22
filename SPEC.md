# Project Specification

## Overview
This is a Next.js project that provides a base template for building modern web applications. It includes essential configurations and components to get started quickly.

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router) v15.2.3
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v3.4.3
- **Language**: TypeScript v5
- **Font**: Geist (via next/font)
- **Authentication & Database**: [Supabase](https://supabase.com/) using @supabase/ssr v0.6.1
- **Validation**: [Zod](https://github.com/colinhacks/zod) v3.24.2
- **React**: v19.0.0
- **React DOM**: v19.0.0
- **Development Enhancement**: TurboPack

## Application Architecture

### Directory Structure
- `app/` - Core application organization following Next.js App Router structure
  - `auth/` - Authentication-related pages (login, signup, error handling)
  - `components/` - App-wide components like navbar
  - `home/` - Public-facing pages accessible without authentication
  - `secure/` - Protected routes requiring authentication
    - `dashboard/` - User dashboard after login
    - `profile/` - User profile management
    - `tasks/` - Task management features
- `components/` - Reusable UI components
  - `ui/` - Base UI components library
- `public/` - Static assets
- `utils/` - Utility functions and helpers
  - `supabase/` - Supabase client implementations (client/server/middleware)
  - `validation/` - Validation schemas and utilities
- `middleware.ts` - Global middleware configuration
- `supabase/` - Supabase schema dumps and database configuration

### Authentication Architecture
This project leverages Supabase for authentication and database services:

- **Authentication Flow**:
  1. Users access the application
  2. Middleware (`middleware.ts`) intercepts requests and passes them to Supabase middleware (`utils/supabase/middleware.ts`)
  3. Supabase middleware checks for authenticated session
  4. Unauthenticated users trying to access protected routes (`/secure/*`) are redirected to `/auth/login`
  5. Authentication state persists through Supabase session cookies
  6. After successful authentication, users are redirected to `/secure/dashboard`

- **Client Implementation**:
  - Client-side Supabase client in `utils/supabase/client.ts` using `createBrowserClient`
  - Server-side Supabase client in `utils/supabase/server.ts` using `createServerClient`
  - Middleware implementation in `utils/supabase/middleware.ts` for route protection

- **User Data**:
  - User authentication data stored in Supabase Auth
  - Extended user data stored in `profiles` table with first_name, last_name, and other profile information
  - Profile created on user signup via server action

### Security Architecture

- **Input Validation**:
  - Comprehensive validation using Zod for type-safe schema validation
  - Client-side validation provides immediate feedback to users
  - Server-side validation ensures data integrity even if client validation is bypassed
  - Validation schemas defined in `utils/validation/auth.ts`
  - Form data validated before processing to prevent injection attacks
  - Error messages are user-friendly and context-specific

- **CSRF Protection**:
  - CSRF (Cross-Site Request Forgery) protection is built into Next.js Server Actions
  - Server Actions require both a POST request method and a Next.js-specific header, preventing CSRF attacks
  - Supabase authentication uses cookies with proper security attributes (HttpOnly, SameSite)
  - Forms use Server Actions via the `formAction` attribute (e.g., `formAction={login}`)
  - This implementation provides robust protection without requiring custom CSRF tokens

- **Route Protection**:
  - Middleware intercepts requests to protected routes
  - Checks for valid authentication session
  - Redirects unauthenticated users to login page

- **Authentication Security**:
  - Credentials processed server-side via Server Actions
  - Passwords never exposed to client-side JavaScript
  - Authentication state managed through Supabase session cookies
  - Form validation prevents submission of invalid data

### Validation Architecture

- **Validation Schemas**:
  - Located in `utils/validation/auth.ts`
  - Common schemas for reusable validation rules (email, password)
  - Compound schemas for form validation (login, signup)
  - TypeScript type inference for type safety

- **Validation Implementation**:
  - **Server-Side**: Form data validated in server actions before processing
  - **Client-Side**: Real-time validation during user input
  - **Error Handling**: Structured error responses for field-specific feedback

- **Form Validation Flow**:
  1. User inputs data into form fields
  2. Client-side validation provides immediate feedback on blur and change events
  3. Form submission is prevented if client-side validation fails
  4. If client validation passes, data is sent to server action
  5. Server action performs validation again as a security measure
  6. Validation errors are returned to client if server validation fails
  7. If all validation passes, the authentication action proceeds

### Database Architecture

- **Tables**:
  - `profiles` - Stores user profile information
    - `id` - Primary key (matches Supabase Auth user ID)
    - `first_name` - User's first name
    - `last_name` - User's last name
    - `avatar_url` - Optional profile picture URL
    - `website` - Optional website URL
    - `bio` - Optional user biography
    - `created_at` - Timestamp for record creation
    - `updated_at` - Timestamp for record updates

### Routing Architecture

- **Public Routes**:
  - `/` - Main landing page
  - `/home/*` - Public pages not requiring authentication
  - `/auth/login` - Login page
  - `/auth/signup` - Signup page
  - `/auth/error` - Error handling for authentication

- **Protected Routes**:
  - `/secure/dashboard` - Main user dashboard
  - `/secure/profile` - User profile management
  - `/secure/tasks` - Task management section

- **Route Protection**:
  - Implemented via middleware
  - Matcher in middleware.ts configuration excludes static files and public routes
  - Redirects unauthenticated users to login

### UI Architecture

- **Global Components**:
  - `Navbar` - Top navigation bar that adapts based on authentication state
    - Shows app name and login link for unauthenticated users
    - Shows app name, navigation links, and user avatar for authenticated users

- **Styling Implementation**:
  - Tailwind CSS for utility-based styling
  - CSS Modules for component-specific styling (e.g., `navbar.module.css`)
  - Global styles in `globals.css`

### Server Actions

- **Authentication Actions**:
  - `login` action in `/app/auth/login/actions.ts`
    - Validates login form data
    - Authenticates user via Supabase
    - Returns structured response with success status and any errors
  - `signup` action in `/app/auth/signup/actions.ts`
    - Validates signup form data
    - Creates user account via Supabase
    - Creates user profile record
    - Returns structured response with success status and any errors

## Development Workflow
1. Make changes to the codebase
2. Run the development server to see changes in real-time: `npm run dev`
3. Build and deploy when ready: `npm run build` followed by `npm run start`

## Performance Optimizations
- TurboPack enabled for faster development experience
- Next.js App Router for improved routing and rendering performance
- Server-side rendering where appropriate
- Server components for reduced client-side JavaScript

## Environment Variables
The following environment variables are required:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase CLI Integration
The Supabase CLI is installed locally in this project and should be used with `npx`. Here are some common commands:

* Always run Supabase commands using `npx` (e.g., `npx supabase start`)
* To get the database schema, run:
  ```bash
  npx supabase db dump --local --file schema_dump.sql
  ```
* The schema dump file should be placed in the `/supabase` folder
* The location of the schema dump file will be at `/supabase/schema_dump.sql`

## Styling with Tailwind CSS
This project is configured with [Tailwind CSS](https://tailwindcss.com) for styling. Tailwind is a utility-first CSS framework that allows for rapid UI development with predefined classes.

Key Tailwind features used in this project:
- Utility classes for styling without writing custom CSS
- Responsive design utilities
- Component styling through class composition

Configuration can be found in `tailwind.config.js` and Tailwind is applied via the `globals.css` file.

## Future Enhancements
- Enhanced password policy with stronger requirements
- Rate limiting for authentication attempts
- Improved session management with timeouts
- Additional security headers
- Comprehensive logout functionality
- Testing framework integration
- More comprehensive error handling
- Expanded component library
- Documentation for individual components
