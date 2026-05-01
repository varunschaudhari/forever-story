# ForeverStory - Project Documentation

## Overview
ForeverStory is a SaaS application for sharing and preserving stories. Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Auth**: Session-based (placeholder - needs JWT/session implementation)

## Project Structure

### Core Directories
- `/src/app` - Next.js App Router (pages, layouts, API routes)
- `/src/lib` - Utilities (mongodb, auth, env config)
- `/src/models` - Mongoose schemas
- `/src/types` - TypeScript interfaces
- `/src/components` - Reusable React components (empty - ready to populate)

### Key Files
- `src/lib/mongodb.ts` - Database connection with caching
- `src/lib/auth.ts` - Session management utilities
- `src/lib/env.ts` - Centralized environment configuration
- `src/models/User.ts` - User schema with password hashing

## Routes

### Public
- `/` - Landing page
- `/auth/signin` - Sign in form
- `/auth/signup` - Sign up form

### Protected (Require Authentication)
- `/dashboard` - Main dashboard
- `/dashboard/stories` - User's stories list
- `/dashboard/settings` - Account settings

### API Endpoints
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Authenticate user
- `GET /api/auth/logout` - Clear session

## Environment Configuration
Variables in `.env.local`:
- `MONGODB_URI` - MongoDB connection string
- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_URL` - Application URL
- `SESSION_SECRET` - Session secret key
- `API_URL` - API base URL

## Important Notes

### Authentication
- `getSession()` in `lib/auth.ts` retrieves current user session
- Used in layouts to protect routes with `redirect('/auth/signin')`
- Session uses HTTP-only cookies
- **TODO**: Implement proper JWT or session token validation

### Database
- Connection pooling implemented in `lib/mongodb.ts`
- User model with bcryptjs password hashing
- Ready for additional models (Story, Comment, etc.)

### Styling
- Global styles in `src/app/globals.css`
- Tailwind component utilities defined: `.btn`, `.btn-primary`, `.btn-secondary`, `.container-custom`
- Custom colors in tailwind config: primary (#3B82F6), secondary (#1F2937), accent (#8B5CF6)

## Next Steps for Development

1. **Auth System**
   - Implement JWT or proper session tokens
   - Add email verification
   - Add password reset flow

2. **Core Models**
   - Story model (title, content, tags, created_at, updated_at)
   - Comment model (nested under stories)
   - Share/Permission model

3. **Components**
   - Create reusable UI components in `/src/components`
   - Story card component
   - Form components
   - Navigation components

4. **Features**
   - Create/edit/delete stories
   - Share stories with others
   - Comment system
   - Search and filtering

5. **Testing**
   - Add Jest configuration
   - Add React Testing Library
   - Unit and integration tests

## Deployment
- Ready for Vercel (native Next.js support)
- Can deploy to AWS, Google Cloud, or any Node.js host
- Environment variables need to be set on deployment platform
- MongoDB Atlas recommended for production

## Code Style
- TypeScript strict mode enabled
- ESLint configured with Next.js rules
- Tailwind for all styling
- No external UI libraries (keeping it lightweight)
