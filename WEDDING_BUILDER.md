# Wedding Builder Form Guide

## Overview

The Wedding Builder is a complete form interface for creating and managing wedding details. It provides a clean, tabbed interface with support for dynamic lists, validation, and MongoDB persistence.

## Features

### 1. Basic Information Tab

**Groom & Bride Names**
- Required fields for both groom and bride
- Text input with validation
- Auto-populated in wedding page title

**Wedding Slug**
- Unique identifier for the wedding page URL
- Lowercase letters, numbers, and hyphens only
- Example: `john-sarah-2024`
- Automatically validated for uniqueness

**Wedding Title**
- Main title displayed on wedding page
- Max 200 characters
- Example: "John & Sarah's Wedding"

**Description**
- Optional story/details about the couple
- Max 2000 characters
- Supports multi-line text

**Wedding Date & Time**
- Date and time picker (HTML5 datetime-local)
- Must be a future date (validated)
- Used for timeline and event planning

**Guest Count**
- Expected number of guests
- Non-negative integer
- Used for statistics and planning

**Budget**
- Optional budget amount in USD
- Non-negative number
- Helps with cost tracking

**Public Toggle**
- Makes wedding visible in public listings
- Allows guests to discover wedding on platform

### 2. Venue Tab

**Complete Venue Information**
- Venue Name (required)
- Street Address (required)
- City (required)
- State/Province (required)
- Zip Code (required)
- Country (required)

**Optional GPS Coordinates**
- Latitude and longitude
- Can be added for map integration in future

All venue fields validated for required values and max lengths.

### 3. Events Tab (Dynamic List)

**Add/Remove Events**
- "Add Event" button to dynamically add event rows
- Each event can be removed independently
- Event list persists across form saves

**Event Fields:**
- **Event Name** - Title of the event (e.g., "Ceremony")
- **Event Type** - Enum select:
  - ceremony
  - reception
  - dinner
  - party
  - custom
- **Date** - Date picker for event date
- **Time** - Time picker in HH:mm format
- **Location** - Venue/location for the event
- **Description** - Optional details about the event

**Example Events:**
```
Ceremony - 2024-06-15, 10:00 AM, Church
Reception - 2024-06-15, 6:00 PM, Ballroom
Dinner & Dancing - 2024-06-15, 8:00 PM, Ballroom
```

### 4. Contacts Tab (Dynamic List)

**Add/Remove Contacts**
- "Add Contact" button to add contact rows
- Each contact can be removed independently
- Contact list persists across form saves

**Contact Fields:**
- **Name** - Contact person's name
- **Relationship** - Enum select:
  - groom
  - bride
  - family
  - friend
  - vendor
- **Email** - Optional email address
- **Phone** - Optional phone number

**Example Contacts:**
```
John Smith (Groom)
Sarah Johnson (Bride)
Maria Garcia (Mother) - Vendor
ABC Catering (Vendor) - +1-555-1234
```

### 5. Gallery Upload (Placeholder)

Currently displays placeholder UI with message "Gallery upload feature coming soon".

Future implementation will support:
- Multiple image upload
- Image preview
- Drag-and-drop interface
- Image deletion
- Reordering capabilities

## Form UI/UX

### Tabbed Navigation
- 4 tabs: Basic, Venue, Events, Contacts
- Click to switch between sections
- Active tab highlighted in blue
- Responsive design (stacked on mobile)

### Visual Feedback
- Error messages in red banner at top
- Success messages in green banner
- Form validation on submission
- Loading state while saving
- Disabled inputs during loading

### Responsive Design
- Single column layout on mobile
- Two-column grid on tablets/desktop
- Touch-friendly button sizes
- Full-width inputs on small screens

### Color Scheme
- Header: Blue to Purple gradient
- Primary buttons: Blue
- Secondary buttons: Light gray
- Borders: Light gray
- Text: Dark gray/black on white background
- Success: Green
- Error: Red

## Data Model

### Wedding Document Structure

```typescript
{
  slug: string;                // Unique wedding identifier
  groomName: string;           // Groom's name
  brideName: string;           // Bride's name
  title: string;               // Wedding title
  description?: string;        // Wedding description
  date: Date;                  // Wedding date
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  events?: [{
    name: string;
    type: 'ceremony'|'reception'|'dinner'|'party'|'custom';
    date: Date;
    time: string;              // HH:mm format
    location?: string;
    description?: string;
  }];
  contacts?: [{
    name: string;
    relationship?: 'groom'|'bride'|'family'|'friend'|'vendor';
    phone?: string;
    email?: string;
  }];
  gallery?: string[];          // Image URLs
  guestCount: number;
  budget?: number;
  isPublic: boolean;
  organizers: ObjectId[];      // User IDs
  createdAt: Date;
  updatedAt: Date;
}
```

## Validation Rules

### Slug
- Required, unique
- Lowercase letters, numbers, hyphens only
- Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`

### Names & Text
- Groom/Bride names: 1-100 characters
- Title: 1-200 characters
- Description: 0-2000 characters
- Event name: 1-100 characters
- Contact name: 1-100 characters

### Dates & Times
- Wedding date: Must be in future
- Event date: Any valid date
- Event time: HH:mm format (24-hour)

### Phone & Email
- Email: Valid email format
- Phone: Standard phone number format with optional +1 prefix

### Selects (Enums)
- Event type: ceremony, reception, dinner, party, custom
- Relationship: groom, bride, family, friend, vendor

## API Integration

### Endpoint
`POST /api/weddings`

### Request Body
```json
{
  "slug": "john-sarah-2024",
  "groomName": "John Smith",
  "brideName": "Sarah Johnson",
  "title": "John & Sarah's Wedding",
  "description": "Join us for our special day...",
  "date": "2024-06-15T10:00:00",
  "venue": {
    "name": "Grand Ballroom",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "guestCount": 150,
  "budget": 50000,
  "isPublic": true,
  "events": [
    {
      "name": "Ceremony",
      "type": "ceremony",
      "date": "2024-06-15",
      "time": "10:00",
      "location": "Church"
    }
  ],
  "contacts": [
    {
      "name": "John Smith",
      "relationship": "groom",
      "email": "john@example.com"
    }
  ]
}
```

### Response
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "slug": "john-sarah-2024",
    "groomName": "John Smith",
    "brideName": "Sarah Johnson",
    ...
    "createdAt": "2024-05-01T10:00:00Z",
    "updatedAt": "2024-05-01T10:00:00Z"
  }
}
```

### Error Handling
- Validation errors: 400 Bad Request
- Duplicate slug: 409 Conflict
- Unauthorized: 401 Unauthorized
- Server errors: 500 Internal Server Error

Error response format:
```json
{
  "success": false,
  "error": "Wedding slug already exists"
}
```

## Page Routes

### Create Wedding
- **Route:** `/dashboard/weddings/new`
- **Component:** `WeddingBuilder`
- **Access:** Authenticated users only
- **Redirect:** To wedding detail page on success

### Wedding Detail (Future)
- **Route:** `/dashboard/weddings/:id`
- **Shows:** Full wedding page with all details

### Public Wedding (Future)
- **Route:** `/weddings/:slug`
- **Shows:** Public wedding page (if isPublic = true)

## File Structure

```
src/
├── components/
│   └── WeddingBuilder.tsx          # Main form component
├── app/
│   └── dashboard/
│       └── weddings/
│           └── new/
│               └── page.tsx         # Form page
├── models/
│   └── Wedding.ts                  # Enhanced Wedding model
└── lib/
    └── validation.ts               # Updated schemas
```

## Component Props

The `WeddingBuilder` component has no props - it manages all state internally.

```typescript
<WeddingBuilder />
```

## State Management

Uses React's `useState` hook for:
- Form data object
- Loading state during submission
- Error message display
- Success message display
- Active tab tracking

All state is local to the component and lost on page refresh (form is not persisted as draft).

## Future Enhancements

1. **Gallery Upload**
   - Multiple file upload
   - Image preview and cropping
   - Delete and reorder images
   - CDN integration for image storage

2. **Autosave/Draft**
   - Save form as draft
   - Auto-save every 30 seconds
   - Restore from draft on page reload

3. **Form Sections**
   - Dress code preferences
   - Registry/gift information
   - Accommodation suggestions
   - Timeline/itinerary builder

4. **Guest Management**
   - Invite guests directly from contacts
   - Track RSVP responses
   - Seating arrangements
   - Gift tracking

5. **Advanced Features**
   - Vendor management
   - Budget tracking
   - Guest communication
   - Photo sharing from guests
   - Wedding website customization

## Usage Example

Visit `/dashboard/weddings/new` after authenticating:
1. Fill in groom and bride names
2. Create a unique wedding slug
3. Enter wedding date and venue
4. Click "Venue" tab to add venue details
5. Click "Events" tab to add ceremony, reception, etc.
6. Click "Contacts" tab to add important contacts
7. Optionally toggle "Make wedding public"
8. Click "Create Wedding" to save

The form validates all inputs on submission. If there are errors, they're displayed in a red banner. On successful creation, you're redirected to the wedding detail page.
