import { z } from 'zod';

// User validation schemas
export const userSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

export type UserSignup = z.infer<typeof userSignupSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

// Wedding validation schemas
export const venueSchema = z.object({
  name: z.string().min(1, 'Venue name is required').max(100),
  address: z.string().min(1, 'Address is required').max(200),
  city: z.string().min(1, 'City is required').max(50),
  state: z.string().min(1, 'State is required').max(50),
  zipCode: z.string().min(1, 'Zip code is required').max(20),
  country: z.string().min(1, 'Country is required').max(50),
  coordinates: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .optional(),
});

export const weddingCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  date: z.string().datetime('Invalid date format').refine(
    (date) => new Date(date) > new Date(),
    'Wedding date must be in the future'
  ),
  venue: venueSchema,
  guestCount: z.number().int().min(0).default(0),
  budget: z.number().min(0).optional(),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string().toLowerCase()).optional(),
});

export const weddingUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  date: z.string().datetime().optional(),
  venue: venueSchema.partial().optional(),
  guestCount: z.number().int().min(0).optional(),
  budget: z.number().min(0).optional(),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string().toLowerCase()).optional(),
});

export type WeddingCreate = z.infer<typeof weddingCreateSchema>;
export type WeddingUpdate = z.infer<typeof weddingUpdateSchema>;

// RSVP validation schemas
export const mealPreferenceEnum = z.enum([
  'vegetarian',
  'vegan',
  'non-vegetarian',
  'no-preference',
]);

export const rsvpStatusEnum = z.enum(['pending', 'accepted', 'declined', 'maybe']);

export const guestSchema = z.object({
  name: z.string().min(1, 'Guest name is required').max(100),
  relationship: z.enum(['friend', 'family', 'colleague', 'other']).optional(),
  dietaryRestrictions: z.string().max(200).optional(),
  mealPreference: mealPreferenceEnum.optional(),
});

export const rsvpCreateSchema = z.object({
  guestEmail: z.string().email('Invalid email format'),
  guestName: z.string().min(1).max(100),
  status: rsvpStatusEnum.default('pending'),
  totalGuests: z.number().int().min(1).max(10).default(1),
  additionalGuests: z.array(guestSchema).optional(),
  dietaryRestrictions: z.string().max(500).optional(),
  mealPreference: mealPreferenceEnum.optional(),
  comments: z.string().max(1000).optional(),
});

export const rsvpUpdateSchema = z.object({
  status: rsvpStatusEnum.optional(),
  totalGuests: z.number().int().min(1).max(10).optional(),
  additionalGuests: z.array(guestSchema).optional(),
  dietaryRestrictions: z.string().max(500).optional(),
  mealPreference: mealPreferenceEnum.optional(),
  comments: z.string().max(1000).optional(),
});

export type RSVPCreate = z.infer<typeof rsvpCreateSchema>;
export type RSVPUpdate = z.infer<typeof rsvpUpdateSchema>;
export type Guest = z.infer<typeof guestSchema>;
