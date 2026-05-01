# MongoDB Setup Guide

## Overview

ForeverStory uses MongoDB with Mongoose ODM for data persistence. This guide covers setting up MongoDB, configuring the connection, and working with the database.

## Prerequisites

- Node.js 18+ and npm
- MongoDB 4.4+ (local or cloud)

## Installation Options

### Option 1: MongoDB Atlas (Cloud - Recommended)

MongoDB Atlas is the official cloud hosting for MongoDB. Perfect for development and production.

1. **Create Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account
   - Complete email verification

2. **Create a Cluster**
   - Click "Create a deployment"
   - Select "M0 Sandbox" (free tier)
   - Choose your region
   - Click "Create"
   - Wait for cluster to deploy (5-10 minutes)

3. **Get Connection String**
   - Go to "Databases" tab
   - Click "Connect" button
   - Select "Drivers"
   - Choose Node.js and version 4.0 or later
   - Copy the connection string
   - Replace `<password>` with your database password

4. **Configure Environment**
   ```bash
   # Update .env.local
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/forever-story?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB

For local development:

**On Windows (Using Chocolatey):**
```bash
choco install mongodb-community
```

**On Mac (Using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Configure .env.local:**
```env
MONGODB_URI=mongodb://localhost:27017/forever-story
```

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `zod` - Schema validation

### 2. Verify MongoDB Connection

Create a test file to verify connection:

```typescript
// test-connection.ts
import { dbConnect } from './src/lib/mongodb';

async function test() {
  try {
    await dbConnect();
    console.log('✅ MongoDB connected successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}

test();
```

Run with:
```bash
npx tsx test-connection.ts
```

### 3. Seed Sample Data

Populate the database with example wedding data:

```bash
npm run seed
```

This creates:
- 4 sample users
- 3 sample weddings
- 5 sample RSVPs

## Database Models

### User
```typescript
{
  email: string;           // Unique, lowercase
  password: string;        // Hashed with bcryptjs
  name: string;            // Full name
  phone?: string;          // Optional phone
  avatar?: string;         // Optional avatar URL
  bio?: string;            // Max 500 characters
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Methods:**
- `comparePassword(password)` - Verify password
- `save()` - Auto-hashes password before saving

### Wedding
```typescript
{
  title: string;           // Required, max 200 chars
  description?: string;    // Max 2000 chars
  organizers: ObjectId[];  // Array of User IDs
  coverImage?: string;     // Image URL
  date: Date;              // Must be future date
  venue: {                 // Complete address object
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: { latitude, longitude };
  };
  guestCount: number;      // Expected guests
  budget?: number;         // Budget amount
  isPublic: boolean;       // Show in public listings
  tags?: string[];         // Searchable tags
  createdAt: Date;
  updatedAt: Date;
}
```

### RSVP
```typescript
{
  wedding: ObjectId;                    // Reference to Wedding
  invitedBy: ObjectId;                  // Reference to User
  guestEmail: string;                   // Unique per wedding
  guestName: string;                    // Guest name
  status: 'pending'|'accepted'|'declined'|'maybe';
  totalGuests: number;                  // 1-10
  additionalGuests?: [{                 // Additional guests
    name: string;
    relationship?: string;
    dietaryRestrictions?: string;
    mealPreference?: string;
  }];
  dietaryRestrictions?: string;         // Max 500 chars
  mealPreference?: string;              // Meal type
  comments?: string;                    // Max 1000 chars
  respondedAt?: Date;                   // Auto-set when status changes
  createdAt: Date;
  updatedAt: Date;
}
```

## Working with the Database

### Using Database Functions

All database operations are in `src/lib/db.ts`:

```typescript
import { dbConnect } from '@/lib/mongodb';
import { 
  getUserById, 
  createWedding, 
  getWeddingsByUser,
  createRSVP,
  getWeddingStats 
} from '@/lib/db';

// In your API routes or server functions
await dbConnect();

// Get user
const user = await getUserById(userId);

// Get user's weddings
const result = await getWeddingsByUser(userId, 1, 10);

// Create wedding
const wedding = await createWedding({
  title: 'My Wedding',
  organizers: [userId],
  // ... other fields
});

// Get wedding statistics
const stats = await getWeddingStats(weddingId);
```

### Input Validation

Use Zod schemas in `src/lib/validation.ts`:

```typescript
import { weddingCreateSchema, rsvpCreateSchema } from '@/lib/validation';

// Validate input
const validData = weddingCreateSchema.parse(req.body);

// With error handling
try {
  const data = weddingCreateSchema.parse(req.body);
} catch (error) {
  if (error instanceof ZodError) {
    // Handle validation errors
  }
}
```

### Error Handling

Use `AppError` for consistent error responses:

```typescript
import { AppError, apiError } from '@/lib/api';

try {
  // database operation
} catch (error) {
  if (error instanceof AppError) {
    return apiError(error, error.statusCode);
  }
  return apiError(error);
}
```

## API Endpoints

### Weddings
```
GET    /api/weddings                    # List user's weddings
GET    /api/weddings?public=true        # Public weddings
POST   /api/weddings                    # Create wedding
GET    /api/weddings/:id                # Get specific wedding
PATCH  /api/weddings/:id                # Update wedding
DELETE /api/weddings/:id                # Delete wedding
GET    /api/weddings/:id/stats          # Get RSVP statistics
```

### RSVPs
```
GET    /api/weddings/:id/rsvp           # List RSVPs for wedding
POST   /api/weddings/:id/rsvp           # Create RSVP
GET    /api/rsvp/:id                    # Get specific RSVP
PATCH  /api/rsvp/:id                    # Update RSVP status
```

## Common Tasks

### Create a User
```typescript
import { createUser } from '@/lib/db';

const user = await createUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword123',
  phone: '+1-555-0100'
});
```

### Create a Wedding
```typescript
import { createWedding } from '@/lib/db';

const wedding = await createWedding({
  title: 'Sarah & John Wedding',
  organizers: [userId],
  date: new Date('2024-06-15'),
  venue: {
    name: 'Grand Hotel',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA'
  },
  guestCount: 150,
  isPublic: true,
  tags: ['summer', 'romantic']
});
```

### Invite Guest (Create RSVP)
```typescript
import { createRSVP } from '@/lib/db';

const rsvp = await createRSVP({
  wedding: weddingId,
  invitedBy: organizerId,
  guestEmail: 'guest@example.com',
  guestName: 'Guest Name',
  status: 'pending',
  totalGuests: 2
});
```

### Get Wedding Statistics
```typescript
import { getWeddingStats } from '@/lib/db';

const stats = await getWeddingStats(weddingId);
// Returns: {
//   totalRSVPs: 150,
//   accepted: 120,
//   declined: 15,
//   pending: 10,
//   maybe: 5,
//   totalGuests: 250,
//   respondedPercentage: 93
// }
```

## Querying the Database

### Find Operations
```typescript
// Find one
const user = await User.findOne({ email: 'user@example.com' });

// Find by ID
const wedding = await Wedding.findById(id);

// Find many with filters
const publicWeddings = await Wedding.find({ isPublic: true });

// With sorting and pagination
const weddings = await Wedding.find()
  .skip(0)
  .limit(10)
  .sort({ date: 1 });
```

### Update Operations
```typescript
// Update one
await User.findByIdAndUpdate(id, { name: 'New Name' });

// Update many
await RSVP.updateMany({ status: 'pending' }, { status: 'maybe' });
```

### Delete Operations
```typescript
// Delete one
await Wedding.findByIdAndDelete(id);

// Delete many
await RSVP.deleteMany({ wedding: weddingId });
```

## Indexes

The system automatically creates indexes for optimal performance:

**User:**
- `email` (unique)

**Wedding:**
- `organizers`
- `date`
- `isPublic`
- `venue.city`
- `tags`

**RSVP:**
- `{ wedding, status }`
- `{ wedding, guestEmail }` (unique)
- `invitedBy`
- `status`
- `respondedAt`

## Troubleshooting

### Connection Issues

```typescript
// Test connection
try {
  await dbConnect();
  console.log('Connected');
} catch (error) {
  console.error('Connection failed:', error.message);
}
```

**Common Issues:**
- Invalid connection string: Check URI syntax
- Authentication failed: Verify username/password
- Network error: Check IP whitelist in MongoDB Atlas
- Database doesn't exist: MongoDB creates it automatically

### Validation Errors

Check Mongoose validation with:
```typescript
try {
  await user.save();
} catch (error) {
  console.log(error.errors); // Field-specific errors
}
```

### Performance

Monitor slow queries:
```bash
# In MongoDB Atlas, go to:
# Databases > Collections > Profiler
# Filter by slow queries (>100ms)
```

## Best Practices

1. **Always use transactions** for multi-document operations
2. **Index frequently queried fields** for better performance
3. **Validate input** with Zod before database operations
4. **Use connection pooling** (handled automatically)
5. **Soft delete** sensitive records instead of hard delete
6. **Document schema changes** and run migrations
7. **Monitor connection health** in production
8. **Backup regularly** using MongoDB Atlas automated backups

## Production Considerations

1. **Enable authentication** (already in connection string)
2. **Use IP whitelist** in MongoDB Atlas
3. **Enable encryption** at rest and in transit
4. **Set up automated backups** (Atlas handles this)
5. **Monitor resource usage** (CPU, memory, connections)
6. **Use connection pooling** with appropriate pool size
7. **Implement rate limiting** on API endpoints
8. **Add query timeout** to prevent long-running queries

## Resources

- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Query Language](https://docs.mongodb.com/manual/reference/)
- [Zod Validation](https://zod.dev/)
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)
