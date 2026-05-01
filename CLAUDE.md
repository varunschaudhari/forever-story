# ForeverStory - Project Documentation

## Overview
ForeverStory is a SaaS application for managing weddings and guest RSVPs. Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS with MongoDB for data persistence.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod schema validation
- **Auth**: Session-based (placeholder - needs JWT/session implementation)
- **Security**: bcryptjs for password hashing

## Project Structure

### Core Directories
- `/src/app` - Next.js App Router (pages, layouts, API routes)
- `/src/lib` - Utilities (mongodb, auth, env, db, api, validation)
- `/src/models` - Mongoose schemas (User, Wedding, RSVP)
- `/src/types` - TypeScript interfaces
- `/src/components` - Reusable React components (empty - ready to populate)

### Key Files
- `src/lib/mongodb.ts` - Database connection with caching
- `src/lib/db.ts` - Database operations (CRUD, pagination, stats)
- `src/lib/auth.ts` - Session management utilities
- `src/lib/api.ts` - API response/error handling, AppError class
- `src/lib/validation.ts` - Zod schemas for input validation
- `src/lib/seed.ts` - Database seed script with sample data
- `src/models/User.ts` - User schema with password hashing and comparePassword()
- `src/models/Wedding.ts` - Wedding schema with venue details and multiple organizers
- `src/models/RSVP.ts` - RSVP schema with guest tracking and meal preferences

## Database Models

### User
- email (unique), password (hashed), name, phone, avatar, bio
- Method: `comparePassword(password)` for authentication
- Index: email (unique)

### Wedding
- title, description, organizers (User[]), date, venue (nested with address + coordinates)
- guestCount, budget, isPublic, tags
- Organizers can be multiple users (one-to-many relationship)
- Indexes: organizers, date, isPublic, venue.city, tags

### RSVP
- wedding (ref), invitedBy (ref), guestEmail, guestName
- status (pending/accepted/declined/maybe)
- totalGuests (1-10), additionalGuests (nested array)
- dietaryRestrictions, mealPreference, comments, respondedAt
- Unique constraint: wedding + guestEmail per wedding
- Indexes: wedding+status, wedding+guestEmail, invitedBy, status, respondedAt

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

**Authentication:**
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Authenticate user
- `GET /api/auth/logout` - Clear session

**Weddings:**
- `GET /api/weddings` - List user's weddings (paginated)
- `GET /api/weddings?public=true` - List public weddings with filters
- `POST /api/weddings` - Create wedding
- `GET /api/weddings/:id` - Get specific wedding
- `PATCH /api/weddings/:id` - Update wedding
- `DELETE /api/weddings/:id` - Delete wedding (cascades to RSVPs)
- `GET /api/weddings/:id/stats` - Get RSVP statistics

**RSVPs:**
- `GET /api/weddings/:id/rsvp` - List RSVPs for wedding
- `POST /api/weddings/:id/rsvp` - Create RSVP
- `GET /api/rsvp/:id` - Get specific RSVP
- `PATCH /api/rsvp/:id` - Update RSVP status and details

## Environment Configuration
Variables in `.env.local`:
- `MONGODB_URI` - MongoDB connection string (local or Atlas)
- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_URL` - Application URL
- `SESSION_SECRET` - Session secret key
- `API_URL` - API base URL

## Database Operations

All database operations are in `src/lib/db.ts`:

**User Operations:**
- `getUserById(id)`, `getUserByEmail(email)`
- `createUser(userData)`, `updateUser(id, updates)`

**Wedding Operations:**
- `getWeddingById(id)` - With populated organizers
- `getWeddingsByUser(userId, page, limit)` - Paginated
- `createWedding(data)`, `updateWedding(id, updates)`
- `deleteWedding(id)` - Cascades to RSVPs
- `getPublicWeddings(page, limit, filters)` - Search by city/tags

**RSVP Operations:**
- `getRSVPById(id)`, `getRSVPsByWedding(weddingId, page, limit)`
- `getRSVPsByStatus(weddingId, status, page, limit)`
- `getRSVPByEmailAndWedding(email, weddingId)` - Check for duplicates
- `createRSVP(data)`, `updateRSVPStatus(id, status, updates)`

**Statistics:**
- `getWeddingStats(weddingId)` - Returns total/accepted/declined/pending/maybe counts and response percentage

## Important Notes

### Authentication
- `getSession()` in `lib/auth.ts` retrieves current user session
- Used in layouts to protect routes with `redirect('/auth/signin')`
- Session uses HTTP-only cookies
- **TODO**: Implement proper JWT or session token validation with actual cookie signing

### Database
- Connection pooling implemented in `lib/mongodb.ts` (singleton pattern)
- Three models: User (auth), Wedding (events), RSVP (guest management)
- Mongoose validation at schema level
- Zod validation for API request bodies
- Pre-save hooks for password hashing and respondedAt timestamps

### Error Handling
- `AppError` class for consistent error responses
- `apiError()` function wraps errors with status codes
- Validation errors from Zod caught and returned with 400 status
- Try-catch in all API routes

### Styling
- Global styles in `src/app/globals.css`
- Tailwind component utilities: `.btn`, `.btn-primary`, `.btn-secondary`, `.container-custom`
- Custom colors: primary (#3B82F6), secondary (#1F2937), accent (#8B5CF6)

## Seeding Database

Run seed script to populate sample data:
```bash
npm run seed
```

Creates:
- 4 sample users
- 3 sample weddings with different access levels
- 5 sample RSVPs with various statuses and additional guests

## Key Dependencies
- `mongoose@8.3.2` - MongoDB ODM
- `bcryptjs@2.4.3` - Password hashing
- `zod@3.23.8` - Schema validation
- `next@14.2.3` - React framework
- `tailwindcss@3.4.3` - Styling

## Next Steps for Development

1. **Auth System**
   - Implement JWT tokens or session cookies properly
   - Add email verification
   - Add password reset flow
   - Add OAuth providers (Google, GitHub)

2. **Features**
   - Create/edit/delete weddings UI
   - RSVP management dashboard
   - Guest list export (PDF/CSV)
   - Email notifications for RSVP updates
   - Photo gallery for weddings
   - Seating chart planner

3. **Components**
   - Create reusable UI components in `/src/components`
   - Wedding card, form components
   - RSVP status badges
   - Statistics dashboard

4. **Testing**
   - Add Jest configuration
   - Add React Testing Library
   - Unit and integration tests for models and API routes
   - Database integration tests

5. **Deployment**
   - Configure for Vercel or other platforms
   - Set up CI/CD pipeline
   - Environment-specific configurations
   - Database backups strategy

## Documentation
- **DATABASE.md** - Complete schema design, relationships, indexes, queries
- **MONGODB_SETUP.md** - Setup instructions, troubleshooting, best practices
- **README.md** - Project overview and getting started

## Code Style
- TypeScript strict mode enabled
- ESLint configured with Next.js rules
- Zod for runtime validation
- AppError class for error handling
- No external UI libraries (Tailwind CSS only)
- Comprehensive model interfaces and types
