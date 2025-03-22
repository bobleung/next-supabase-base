# Project Specification

## Overview
This is a Next.js project that provides a base template for building modern web applications. It includes essential configurations and components to get started quickly.

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript
- **Font**: Geist (via next/font)

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

## Development Workflow
1. Make changes to the codebase
2. Run the development server to see changes in real-time
3. Build and deploy when ready

## Deployment
The project is optimized for deployment on Vercel, but can be deployed to any platform that supports Next.js.
