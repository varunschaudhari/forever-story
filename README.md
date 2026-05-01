# ForeverStory - SaaS Platform

A modern SaaS application built with Next.js 14, TypeScript, and Tailwind CSS for preserving and sharing stories.

## 🏗️ Project Structure

```
forever-story/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── auth/          # Authentication endpoints
│   │   ├── auth/              # Authentication pages
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── dashboard/         # Protected dashboard pages
│   │   │   ├── stories/
│   │   │   └── settings/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts           # Authentication helpers
│   │   ├── env.ts            # Environment config
│   │   └── mongodb.ts        # Database connection
│   ├── models/                # Mongoose schemas
│   │   └── User.ts
│   └── types/                 # TypeScript types
│       └── index.ts
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── .env.local                # Local environment variables
├── tailwind.config.ts        # Tailwind CSS config
├── tsconfig.json             # TypeScript config
├── next.config.js            # Next.js config
└── package.json              # Project dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd forever-story
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your MongoDB URI and other configuration.

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Key Directories

### `/src/app`
Next.js App Router pages and layouts. Each directory with `layout.tsx` creates a route segment.

### `/src/lib`
Utility functions and configurations:
- `mongodb.ts` - Database connection with caching
- `auth.ts` - Session/authentication utilities
- `env.ts` - Centralized environment configuration

### `/src/models`
Mongoose schema definitions for MongoDB collections.

### `/src/types`
TypeScript interfaces and types for type safety throughout the app.

## 🔐 Authentication

The project includes basic authentication scaffolding:
- Sign up: `/auth/signup`
- Sign in: `/auth/signin`
- Sign out: `/api/auth/logout`

Protected routes use the `getSession()` utility to verify user authentication.

## 🗄️ Database

MongoDB integration with Mongoose:
- Connection pooling with caching for optimal performance
- User model with password hashing (bcryptjs)
- Ready for additional models

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- Global component utilities (`.btn`, `.btn-primary`, `.container-custom`)
- Responsive design patterns

## 📝 Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/forever-story

# Application
NEXT_PUBLIC_APP_NAME=ForeverStory
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Session
SESSION_SECRET=your-secret-key

# API
API_URL=http://localhost:3000/api
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📚 Next Steps

1. **Authentication**: Complete session/JWT implementation in `lib/auth.ts`
2. **Database Models**: Add Story, Comment, and other domain models
3. **API Routes**: Implement CRUD operations for stories
4. **Components**: Create reusable UI components in `/src/components`
5. **Testing**: Add Jest and React Testing Library
6. **Deployment**: Configure for Vercel, AWS, or your hosting platform

## 🔧 Best Practices

- **Type Safety**: Full TypeScript coverage
- **Environment Config**: Centralized in `lib/env.ts`
- **Database**: Connection pooling with graceful error handling
- **Protected Routes**: Use `getSession()` for route protection
- **Code Organization**: Clear separation of concerns

## 📄 License

MIT
