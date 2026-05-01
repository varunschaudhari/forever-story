# MongoDB & Models - Quick Reference

## Models Overview

```
┌─────────────┐         ┌──────────────┐         ┌───────┐
│    User     │         │   Wedding    │         │ RSVP  │
├─────────────┤         ├──────────────┤         ├───────┤
│ id          │         │ id           │         │ id    │
│ email       │         │ title        │         │ wedding (ref)
│ password    │ 1───∞   │ organizers[] │ 1───∞   │ invitedBy (ref)
│ name        │ (hash)  │ date         │ (ref)   │ guestEmail
│ phone       │         │ venue        │         │ guestName
│ avatar      │         │ guestCount   │         │ status
│ bio         │         │ budget       │         │ totalGuests
├─────────────┤         │ isPublic     │         │ additionalGuests[]
│ compare     │         │ tags         │         │ dietaryRestrictions
│ Password()  │         ├──────────────┤         │ mealPreference
└─────────────┘         │ Methods:     │         │ comments
                        │ - populate   │         ├───────┤
                        │   organizers │         │ Auto-set respondedAt
                        └──────────────┘         │ when status changes
                                                 └───────┘
```

## Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure MongoDB
cp .env.example .env.local
# Edit MONGODB_URI in .env.local

# 3. Seed sample data
npm run seed

# 4. Start development server
npm run dev
```

## Database Operations Cheat Sheet

### Users
```typescript
import { createUser, getUserById, getUserByEmail, updateUser } from '@/lib/db';

// Create user
const user = await createUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePass123'
});

// Get user
const user = await getUserById(userId);
const user = await getUserByEmail('john@example.com');

// Update user
await updateUser(userId, { name: 'Jane Doe' });

// Compare password (instance method)
const isValid = await user.comparePassword('password123');
```

### Weddings
```typescript
import { createWedding, getWeddingById, getWeddingsByUser, updateWedding, deleteWedding, getPublicWeddings } from '@/lib/db';

// Create wedding
const wedding = await createWedding({
  title: 'John & Sarah Wedding',
  organizers: [userId],
  date: new Date('2024-06-15'),
  venue: {
    name: 'Grand Ballroom',
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

// Get wedding
const wedding = await getWeddingById(weddingId);

// Get user's weddings (paginated)
const result = await getWeddingsByUser(userId, page, limit);
// Returns: { data: [], total, page, limit, totalPages }

// Get public weddings with filters
const result = await getPublicWeddings(1, 10, { 
  city: 'New York',
  tags: ['summer']
});

// Update wedding
await updateWedding(weddingId, { title: 'Updated Title' });

// Delete wedding (cascades to RSVPs)
await deleteWedding(weddingId);
```

### RSVPs
```typescript
import { createRSVP, getRSVPById, getRSVPsByWedding, getRSVPsByStatus, updateRSVPStatus, getWeddingStats } from '@/lib/db';

// Create RSVP
const rsvp = await createRSVP({
  wedding: weddingId,
  invitedBy: organizerId,
  guestEmail: 'guest@example.com',
  guestName: 'Guest Name',
  status: 'pending',
  totalGuests: 2,
  additionalGuests: [{
    name: 'Plus One',
    relationship: 'friend',
    mealPreference: 'vegetarian'
  }],
  dietaryRestrictions: 'Nut allergy',
  mealPreference: 'non-vegetarian'
});

// Get RSVP
const rsvp = await getRSVPById(rsvpId);

// Get all RSVPs for wedding
const result = await getRSVPsByWedding(weddingId, page, limit);

// Get RSVPs by status
const accepted = await getRSVPsByStatus(weddingId, 'accepted', page, limit);

// Update RSVP status
await updateRSVPStatus(rsvpId, 'accepted', {
  totalGuests: 3,
  comments: 'Excited to attend!'
});

// Get wedding statistics
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

## Validation Schemas

```typescript
import {
  weddingCreateSchema,
  rsvpCreateSchema,
  userSignupSchema
} from '@/lib/validation';

// Validate wedding data
try {
  const data = weddingCreateSchema.parse(requestBody);
  // data is type-safe: WeddingCreate
} catch (error) {
  // Handle ZodError
}

// Validate RSVP data
const rsvpData = rsvpCreateSchema.parse(body);

// Validate user signup
const user = userSignupSchema.parse(body);
```

## API Endpoints

### Weddings
```
GET    /api/weddings                    # List user's weddings
GET    /api/weddings?public=true        # List public weddings
GET    /api/weddings?city=New%20York    # Filter by city
GET    /api/weddings?tags=summer        # Filter by tags
GET    /api/weddings?page=2&limit=20    # Pagination
POST   /api/weddings                    # Create wedding
GET    /api/weddings/:id                # Get wedding
PATCH  /api/weddings/:id                # Update wedding
DELETE /api/weddings/:id                # Delete wedding
GET    /api/weddings/:id/stats          # Get statistics
```

### RSVPs
```
GET    /api/weddings/:id/rsvp           # List RSVPs
GET    /api/weddings/:id/rsvp?status=accepted
POST   /api/weddings/:id/rsvp           # Create RSVP
GET    /api/rsvp/:id                    # Get RSVP
PATCH  /api/rsvp/:id                    # Update RSVP
```

## Error Handling

```typescript
import { AppError, apiError, apiResponse } from '@/lib/api';

// Throw error
throw new AppError('User not found', 404, 'NOT_FOUND');

// Return error response
return apiError(error);
return apiError(error, 500, 'Internal error');

// Return success response
return apiResponse(data);
return apiResponse(data, 201); // Created
```

## Mongoose Queries

```typescript
// Direct Mongoose queries (when not using db.ts helpers)

// Find one
const user = await User.findOne({ email: 'john@example.com' });

// Find by ID
const wedding = await Wedding.findById(id).populate('organizers');

// Find many with filters
const weddings = await Wedding.find({ isPublic: true });

// With sorting and pagination
const weddings = await Wedding.find()
  .skip(0)
  .limit(10)
  .sort({ date: 1 });

// Count documents
const count = await Wedding.countDocuments({ isPublic: true });

// Update one
const updated = await Wedding.findByIdAndUpdate(id, updates, { new: true });

// Delete one
await Wedding.findByIdAndDelete(id);

// Delete many
await RSVP.deleteMany({ wedding: weddingId });
```

## Types

```typescript
// Import from @/types
import type {
  User,
  Wedding,
  RSVP,
  Guest,
  ApiResponse,
  PaginatedResponse,
  WeddingStats
} from '@/types';

// Or import models directly
import type { IUser } from '@/models/User';
import type { IWedding } from '@/models/Wedding';
import type { IRSVP } from '@/models/RSVP';
```

## Common Patterns

### Paginate Results
```typescript
const page = parseInt(query.page || '1');
const limit = parseInt(query.limit || '10');
const result = await getWeddingsByUser(userId, page, limit);

return apiResponse({
  data: result.data,
  pagination: {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages
  }
});
```

### Check Ownership
```typescript
const wedding = await getWeddingById(weddingId);
if (!wedding.organizers.some(id => id.toString() === userId)) {
  throw new AppError('Not authorized', 403, 'FORBIDDEN');
}
```

### Cascade Delete
```typescript
// Deleting a wedding automatically deletes RSVPs
const deleted = await deleteWedding(weddingId);
```

### Transaction (for multi-document ops)
```typescript
// Use Mongoose transactions for atomicity
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Operations with { session }
  await wedding.save({ session });
  await rsvp.save({ session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

## Testing MongoDB

```typescript
// Test connection
import { dbConnect } from '@/lib/mongodb';

await dbConnect();
console.log('✅ Connected');

// Test model
const user = await createUser({
  name: 'Test',
  email: 'test@example.com',
  password: 'password123'
});
console.log('✅ User created:', user._id);
```

## Indexes

**Automatically created:**
- User: `email` (unique)
- Wedding: `organizers`, `date`, `isPublic`, `venue.city`, `tags`
- RSVP: `{ wedding, status }`, `{ wedding, guestEmail }` (unique), `invitedBy`, `status`, `respondedAt`

**Check in MongoDB Atlas:**
1. Go to Databases > Collections
2. Select collection
3. Go to Indexes tab
4. Monitor slow queries in Profiler

## Performance Tips

1. **Populate selectively** - only populate needed fields
   ```typescript
   Wedding.findById(id).select('title date').populate('organizers', 'name email')
   ```

2. **Use pagination** - limit returned documents
3. **Create indexes** - for frequently queried fields
4. **Batch operations** - use bulk writes for many documents
5. **Project fields** - don't select unnecessary fields
   ```typescript
   User.find().select('-password')
   ```

## Common Issues

| Issue | Solution |
|-------|----------|
| `MongoConnectionError` | Check MONGODB_URI and network/firewall |
| `Validation failed` | Check schema rules in error message |
| `E11000 duplicate key` | Email already exists, check unique fields |
| `CastError` | Invalid MongoDB ObjectId format |
| `Slow queries` | Check indexes, add missing indexes |
| `Memory leak` | Close database connection on shutdown |

## Resources

- [Mongoose Docs](https://mongoosejs.com/docs)
- [MongoDB Query Language](https://docs.mongodb.com/manual/)
- [Zod Validation](https://zod.dev/)
- [DATABASE.md](./DATABASE.md) - Full schema documentation
- [MONGODB_SETUP.md](./MONGODB_SETUP.md) - Setup and configuration
