# Database Schema Documentation

## Overview

ForeverStory uses MongoDB with Mongoose for data persistence. The database contains three main collections: **User**, **Wedding**, and **RSVP**, with relationships designed to support wedding event management.

## Collections

### 1. User Collection

Stores user account information with authentication capabilities.

**Location:** `src/models/User.ts`

**Interface:**
```typescript
interface IUser extends Document {
  email: string;              // Unique email address
  password: string;           // Hashed password (bcryptjs)
  name: string;               // Full name
  phone?: string;             // Optional phone number
  avatar?: string;            // Optional avatar image URL
  bio?: string;               // Optional biography (max 500 chars)
  createdAt: Date;            // Account creation timestamp
  updatedAt: Date;            // Last update timestamp
}
```

**Schema Details:**
- **email**: Unique, lowercase, validated with regex
- **password**: Minimum 6 characters, hashed before storage using bcryptjs (salt: 10)
- **name**: Required, trimmed
- **Indexes**: `email` (unique)

**Methods:**
- `comparePassword(password)` - Async password comparison using bcryptjs

**Hooks:**
- Pre-save: Automatically hashes password if modified

### 2. Wedding Collection

Stores wedding event information created by users.

**Location:** `src/models/Wedding.ts`

**Interface:**
```typescript
interface IWedding extends Document {
  title: string;                          // Wedding title (max 200 chars)
  description?: string;                   // Optional description (max 2000 chars)
  organizers: ObjectId[];                 // Array of User IDs who manage wedding
  coverImage?: string;                    // Optional cover image URL
  date: Date;                             // Wedding date (must be future date)
  venue: {
    name: string;                         // Venue name
    address: string;                      // Street address
    city: string;                         // City
    state: string;                        // State/Province
    zipCode: string;                      // Postal code
    country: string;                      // Country
    coordinates?: {                       // Optional GPS coordinates
      latitude: number;
      longitude: number;
    };
  };
  guestCount: number;                     // Total expected guests (default: 0)
  budget?: number;                        // Optional budget amount
  isPublic: boolean;                      // Whether visible in public listings
  tags?: string[];                        // Searchable tags (lowercase)
  createdAt: Date;                        // Creation timestamp
  updatedAt: Date;                        // Last update timestamp
}
```

**Schema Details:**
- **organizers**: Populated with User references for full organizer details
- **date**: Validated to ensure future dates only
- **venue**: Nested object with complete address information
- **guestCount**: Non-negative integer
- **budget**: Non-negative currency value
- **tags**: Automatically lowercased for consistent searching

**Indexes:**
- `organizers` (1) - Query weddings by organizer
- `date` (1) - Sort weddings by date
- `isPublic` (1) - Filter public/private weddings
- `venue.city` (1) - Search weddings by city
- `tags` (1) - Search weddings by tags

**Relationships:**
- `organizers` → User (one-to-many)
- Referenced by RSVP documents

### 3. RSVP Collection

Stores guest responses to wedding invitations.

**Location:** `src/models/RSVP.ts`

**Interface:**
```typescript
interface IRSVP extends Document {
  wedding: ObjectId;                      // Reference to Wedding
  invitedBy: ObjectId;                    // User who sent the invitation
  guestEmail: string;                     // Guest email (unique per wedding)
  guestName: string;                      // Guest's full name
  status: 'pending'|'accepted'|'declined'|'maybe';  // RSVP status
  totalGuests: number;                    // Number of guests in party (1-10)
  additionalGuests?: Guest[];             // Details of other guests
  dietaryRestrictions?: string;           // Dietary needs (max 500 chars)
  mealPreference?: 'vegetarian'|'vegan'|'non-vegetarian'|'no-preference';
  comments?: string;                      // Optional comments (max 1000 chars)
  respondedAt?: Date;                     // When guest responded (auto-set)
  createdAt: Date;                        // Invitation sent timestamp
  updatedAt: Date;                        // Last update timestamp
}

interface IGuest {
  name: string;                           // Additional guest name
  relationship?: 'friend'|'family'|'colleague'|'other';
  dietaryRestrictions?: string;           // Individual restrictions
  mealPreference?: MealPreference;        // Individual meal preference
}
```

**Schema Details:**
- **guestEmail**: Unique per wedding, validated with regex
- **status**: Enum-validated (pending, accepted, declined, maybe)
- **totalGuests**: Minimum 1, maximum 10
- **additionalGuests**: Nested array of guest objects
- **respondedAt**: Auto-populated when status changes from pending

**Indexes:**
- `{ wedding: 1, status: 1 }` - Get RSVPs by status for a wedding
- `{ wedding: 1, guestEmail: 1 }` (unique) - Prevent duplicate invitations
- `invitedBy` (1) - Query invitations by user
- `status` (1) - Global status queries
- `respondedAt` (1) - Timeline queries

**Relationships:**
- `wedding` → Wedding (many-to-one)
- `invitedBy` → User (many-to-one)

**Hooks:**
- Pre-save: Sets `respondedAt` when status changes from pending

## Relationships Diagram

```
User
├─ organizers in Wedding (1:N)
├─ invitedBy in RSVP (1:N)
└─ comparePassword() method

Wedding
├─ organizers references User (N:1)
└─ referenced by RSVP.wedding (1:N)

RSVP
├─ wedding references Wedding (N:1)
├─ invitedBy references User (N:1)
└─ additionalGuests nested array
```

## Database Operations

All database operations are abstracted in `src/lib/db.ts`:

### User Operations
- `getUserById(id)` - Fetch user by ID
- `getUserByEmail(email)` - Find user by email
- `createUser(userData)` - Create new user
- `updateUser(id, updates)` - Update user fields

### Wedding Operations
- `getWeddingById(id)` - Fetch single wedding with organizers
- `getWeddingsByUser(userId, page, limit)` - Paginated user's weddings
- `createWedding(data)` - Create new wedding
- `updateWedding(id, updates)` - Update wedding
- `deleteWedding(id)` - Delete wedding and associated RSVPs
- `getPublicWeddings(page, limit, filters)` - Search public weddings

### RSVP Operations
- `getRSVPById(id)` - Fetch single RSVP
- `getRSVPsByWedding(weddingId, page, limit)` - Paginated RSVPs for wedding
- `getRSVPsByStatus(weddingId, status, page, limit)` - Filter by status
- `createRSVP(data)` - Create new RSVP
- `updateRSVPStatus(id, status, updates)` - Update RSVP status
- `getRSVPByEmailAndWedding(email, weddingId)` - Check for existing RSVP

### Statistics
- `getWeddingStats(weddingId)` - Get RSVP counts and response rate

## Validation Rules

### User
- Email: Valid email format, unique
- Password: Min 6 characters (hashed with bcryptjs)
- Name: Required, trimmed
- Bio: Max 500 characters

### Wedding
- Title: Required, max 200 characters
- Date: Required, must be future date
- Venue: All fields required (name, address, city, state, zipCode, country)
- guestCount: Minimum 0
- Budget: Minimum 0
- Tags: Automatically lowercased

### RSVP
- guestEmail: Valid email, unique per wedding
- guestName: Required, trimmed
- status: One of (pending, accepted, declined, maybe)
- totalGuests: 1-10
- mealPreference: One of valid options or no-preference
- comments: Max 1000 characters
- dietaryRestrictions: Max 500 characters

## Query Patterns

### Common Queries

**Get all weddings for a user:**
```typescript
const weddings = await getWeddingsByUser(userId, 1, 10);
```

**Get RSVP statistics for a wedding:**
```typescript
const stats = await getWeddingStats(weddingId);
// Returns: { totalRSVPs, accepted, declined, pending, maybe, totalGuests, respondedPercentage }
```

**Search public weddings by city:**
```typescript
const weddings = await getPublicWeddings(1, 10, { city: 'New York' });
```

**Get RSVPs by status:**
```typescript
const accepted = await getRSVPsByStatus(weddingId, 'accepted', 1, 20);
```

## Performance Considerations

1. **Indexes**: Strategic indexes on frequently queried fields
   - User lookups: email index
   - Wedding filtering: organizers, date, isPublic, city, tags
   - RSVP filtering: wedding+status, wedding+email (unique), invitedBy, respondedAt

2. **Pagination**: All list endpoints paginate results to prevent large payloads

3. **Population**: Relationships automatically populated with user/wedding details in API responses

4. **Connection Pooling**: MongoDB connection cached in development, uses connection pooling in production

## Data Integrity

1. **Cascade Deletes**: Deleting a wedding automatically deletes all associated RSVPs
2. **Unique Constraints**: Email (User), wedding+email (RSVP)
3. **Foreign Key Relationships**: Organizers and invitedBy reference valid User documents
4. **Validation**: All fields validated at schema level with custom error messages

## Migration Considerations

When making schema changes:

1. Use `runValidators: true` in update operations
2. Consider backward compatibility for existing documents
3. Add indexes before deploying to production
4. Monitor slow queries using MongoDB profiler

## API Endpoints

- `GET/POST /api/weddings` - List/create weddings
- `GET/PATCH/DELETE /api/weddings/:id` - Get/update/delete wedding
- `GET/POST /api/weddings/:id/rsvp` - List/create RSVPs
- `GET/PATCH /api/rsvp/:id` - Get/update RSVP
- `GET /api/weddings/:id/stats` - Get wedding statistics
