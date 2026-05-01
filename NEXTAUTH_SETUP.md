# NextAuth.js Configuration Guide

## Overview

ForeverStory uses NextAuth.js v5 with the Credentials provider for authentication. Users register with email/password and authenticate against the MongoDB User database.

## Setup

### 1. Environment Variables

Configure these in `.env.local`:

```env
# Required for NextAuth
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters
NEXTAUTH_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/forever-story
```

**Generating NEXTAUTH_SECRET:**

```bash
# Using OpenSSL (Unix/Mac)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using Python
python -c "import secrets; print(secrets.token_hex(32))"
```

For production:
- Use a strong random secret (min 32 characters)
- Store securely in your deployment platform's secrets/environment variables

### 2. File Structure

```
src/
├── auth.ts                           # NextAuth configuration
├── middleware.ts                     # Route protection middleware
├── app/
│   ├── layout.tsx                   # SessionProvider wrapper
│   ├── api/auth/[...nextauth]/      # NextAuth API routes
│   │   └── route.ts
│   ├── api/auth/register/           # Custom signup endpoint
│   │   └── route.ts
│   ├── auth/
│   │   ├── signin/page.tsx          # Login form
│   │   ├── signup/page.tsx          # Registration form
│   │   └── error/page.tsx           # Auth error page
│   └── dashboard/
│       ├── layout.tsx               # Protected layout
│       └── ...                      # Protected pages
└── components/
    └── SignOutButton.tsx            # Sign out action
```

## Configuration Details

### Authentication Flow

**Registration (Sign Up):**
1. User fills signup form
2. Data sent to `/api/auth/register`
3. User created in MongoDB with hashed password
4. User redirected to signin page
5. User signs in with credentials

**Login (Sign In):**
1. User enters email and password
2. NextAuth calls Credentials provider `authorize()` function
3. User looked up in MongoDB
4. Password verified using bcryptjs
5. JWT token created and stored in session cookie
6. User redirected to dashboard

**Session Management:**
- Strategy: JWT (JSON Web Tokens)
- Storage: HTTP-only cookies (secure, not accessible to JavaScript)
- Duration: 30 days (configurable)
- Updates: Checked every 24 hours

**Logout (Sign Out):**
1. User clicks Sign Out button
2. NextAuth clears session cookie
3. User redirected to home page

### NextAuth Configuration (`src/auth.ts`)

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      authorize(credentials) {
        // Validate and authenticate user
        // Return user object or null
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',      // Login page
    signUp: '/auth/signup',      // Registration page (custom)
    error: '/auth/error',         // Error page
  },
  callbacks: {
    jwt({ token, user }) {
      // Called when JWT is created/updated
      // Add user info to token
    },
    session({ session, token }) {
      // Called when session is accessed
      // Add token data to session
    },
  },
  session: {
    strategy: 'jwt',              // Use JWT instead of database
    maxAge: 30 * 24 * 60 * 60,   // 30 days
    updateAge: 24 * 60 * 60,     // Update every 24 hours
  },
});
```

### Route Protection (`src/middleware.ts`)

Middleware automatically:
- Redirects unauthenticated users from `/dashboard/*` to `/auth/signin?callbackUrl=...`
- Redirects authenticated users from `/auth/signin` and `/auth/signup` to `/dashboard`

**Protected Routes:**
- `/dashboard` and all subroutes

**Public Routes:**
- `/` (home)
- `/auth/signin`
- `/auth/signup`
- `/auth/error`
- `/api/auth/*` (NextAuth endpoints)
- `/api/auth/register` (signup endpoint)

## Usage

### Getting the Session

**In Server Components:**
```typescript
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div>
      <p>Logged in as: {session.user?.email}</p>
      <p>Name: {session.user?.name}</p>
    </div>
  );
}
```

**In Client Components:**
```typescript
'use client';

import { useSession } from 'next-auth/react';

export default function Component() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Not signed in</p>;

  return <p>Welcome {session?.user?.name}</p>;
}
```

### Sign In

```typescript
'use client';

import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      email: 'user@example.com',
      password: 'password123',
      redirect: false, // Don't auto-redirect
    });

    if (result?.ok) {
      // Success
      router.push('/dashboard');
    } else {
      // Error - result?.error contains message
      console.error(result?.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Sign Out

```typescript
'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button onClick={() => signOut({ redirectTo: '/' })}>
      Sign Out
    </button>
  );
}
```

### Sign Up (Register)

```typescript
'use client';

const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePassword123',
  }),
});

const data = await response.json();
if (response.ok) {
  // User created successfully
  // Redirect to signin
} else {
  // Error: data.error
}
```

## Session Object Structure

```typescript
interface Session {
  user?: {
    id: string;           // User MongoDB ID
    email: string;        // User email
    name: string;         // User full name
    image?: string;       // Avatar URL
  };
  expires: string;        // ISO 8601 datetime
}
```

## Security Features

1. **Password Hashing:**
   - Passwords hashed with bcryptjs (salt: 10 rounds)
   - Never stored in plain text
   - Verified with constant-time comparison

2. **Session Security:**
   - JWT tokens signed with NEXTAUTH_SECRET
   - Stored in HTTP-only cookies
   - CSRF protection enabled
   - Secure flag set in production

3. **Input Validation:**
   - Email format validation
   - Password minimum length (6 characters)
   - Request body validation with Zod

4. **Rate Limiting:**
   - Recommended to add on signup/signin endpoints
   - Prevent brute force attacks

## Common Tasks

### Protect an Entire Route

The middleware automatically protects `/dashboard/*` routes. To protect other routes, add them to `protectedRoutes` in `src/middleware.ts`:

```typescript
const protectedRoutes = ['/dashboard', '/admin', '/api/protected'];
```

### Check Authentication in API Routes

```typescript
import { auth } from '@/auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // User is authenticated
  const userId = session.user?.id;
  // ... handle request
}
```

### Add Custom User Fields to Session

1. Update `src/auth.ts` callbacks:

```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.phone = user.phone;  // Add custom field
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.phone = token.phone;  // Add to session
    }
    return session;
  },
},
```

2. Extend the Session type:

```typescript
// Create types/next-auth.d.ts
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      phone?: string;
    } & DefaultSession['user'];
  }
}
```

### Add OAuth Providers

To add Google, GitHub, etc.:

```typescript
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  GithubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  }),
  // ... existing Credentials provider
],
```

### Set up Email Verification

Currently not implemented. To add:

1. Create email verification model in MongoDB
2. Send verification email on signup
3. Verify token before allowing login
4. Mark user as verified

### Password Reset

Currently not implemented. To add:

1. Create reset token endpoint
2. Send reset email with token link
3. Verify token and allow password change
4. Invalidate old sessions

## Troubleshooting

### NEXTAUTH_SECRET not set

**Error:** `Error: NEXTAUTH_SECRET is not set`

**Fix:**
1. Generate secret: `openssl rand -base64 32`
2. Add to `.env.local`: `NEXTAUTH_SECRET=<generated-value>`
3. Restart development server

### Session not persisting

**Problem:** User logged in but session lost on page refresh

**Fix:**
1. Ensure SessionProvider wraps app: `<SessionProvider>{children}</SessionProvider>`
2. Check NEXTAUTH_SECRET is set
3. Verify middleware is configured correctly
4. Check browser allows cookies

### Invalid email or password error

**Problem:** Credentials always rejected even with correct password

**Causes:**
- User not found in MongoDB (case sensitivity)
- Password hashing issue
- Database not connected

**Fix:**
1. Verify user exists: `db.users.findOne({email: "user@example.com"})`
2. Check password hashing in User model
3. Verify MongoDB connection

### Redirect loop between signin and dashboard

**Problem:** User stuck redirecting between pages

**Causes:**
- Middleware configuration issue
- Session not persisting
- Protected routes not properly configured

**Fix:**
1. Check middleware regex matches intended routes
2. Verify SessionProvider in root layout
3. Clear browser cache and cookies
4. Check browser console for errors

## Best Practices

1. **Environment Variables:**
   - Never commit secrets to git
   - Use `.env.local` for development
   - Use deployment platform's secrets for production

2. **Session Security:**
   - Set `NEXTAUTH_URL` to match your domain
   - Use HTTPS in production (Secure cookie flag)
   - Regenerate NEXTAUTH_SECRET periodically

3. **Password Security:**
   - Require minimum 8 characters in production
   - Consider adding password strength meter
   - Implement rate limiting on signin/signup
   - Log failed login attempts

4. **User Experience:**
   - Show clear error messages
   - Implement "Remember me" for trusted devices
   - Add password reset flow
   - Show loading states during auth

5. **Monitoring:**
   - Log authentication events
   - Monitor failed login attempts
   - Alert on suspicious activity
   - Track session duration

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NextAuth Credentials Provider](https://next-auth.js.org/providers/credentials)
- [NextAuth v5 Migration Guide](https://next-auth.js.org/getting-started/upgrade-to-v5)
- [JWT Handbook](https://auth0.com/resources/ebooks/jwt-handbook)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## Migration Checklist

When adding NextAuth to an existing project:

- ✅ Install `next-auth`
- ✅ Generate NEXTAUTH_SECRET
- ✅ Create `src/auth.ts` configuration
- ✅ Create API route handler at `src/app/api/auth/[...nextauth]/route.ts`
- ✅ Update root layout with SessionProvider
- ✅ Create `src/middleware.ts` for route protection
- ✅ Update signin/signup pages
- ✅ Remove old session management code
- ✅ Test authentication flow end-to-end
- ✅ Update documentation
- ✅ Deploy with proper environment variables
