# Project Specification

## Overview
This is a Next.js project that provides a base template for building modern web applications. It includes essential configurations and components to get started quickly.

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript
- **Font**: Geist (via next/font)
- **Authentication & Database**: [Supabase](https://supabase.com/)

## Supabase Integration
This project leverages Supabase for authentication and database services:

- **Authentication**: Implemented using Supabase Auth with session management
- **Middleware**: Protects routes and redirects unauthenticated users to the login page
- **Client & Server Components**: Both client and server-side Supabase clients are configured
- **Environment Variables**: Requires Supabase URL and anon key configuration

### Authentication Flow
1. Users access the application
2. Middleware checks for authenticated session
3. Unauthenticated users are redirected to `/auth/login`
4. After successful authentication, users can access protected routes
5. Authentication state persists through Supabase session cookies

## Tailwind CSS Implementation
This project extensively utilizes Tailwind CSS for all styling needs:

- Configured in `tailwind.config.js` with content paths set to scan all components and pages
- Global styles imported in `globals.css`
- Utility-first approach for all component styling
- Responsive design implemented through Tailwind's responsive modifiers
- Custom theme extensions available in the Tailwind configuration

## Project Structure
- `app/` - Contains all routes, layouts, and pages using Next.js App Router
- `components/` - Reusable UI components
- `public/` - Static assets
- `utils/supabase/` - Supabase client configurations and middleware
- `app/auth/` - Authentication-related pages and components

## Development Workflow
1. Make changes to the codebase
2. Run the development server to see changes in real-time
3. Build and deploy when ready

## Deployment
...
