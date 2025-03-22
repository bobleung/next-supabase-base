This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication with Supabase

This project uses [Supabase](https://supabase.io) for authentication and database services. The authentication flow is implemented as follows:

- User authentication is handled through Supabase Auth
- Protected routes require authentication
- Middleware redirects unauthenticated users to `/auth/login`
- Authentication state is managed through Supabase session cookies

To set up Supabase:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Add your Supabase URL and anon key to the environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Using Supabase CLI

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
