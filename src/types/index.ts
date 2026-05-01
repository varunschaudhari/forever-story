import { IUser } from '@/models/User';
import { IWedding } from '@/models/Wedding';
import { IRSVP, RSVPStatus, MealPreference } from '@/models/RSVP';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Wedding types
export interface Wedding {
  id: string;
  title: string;
  description?: string;
  organizers: string[];
  coverImage?: string;
  date: Date;
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
  guestCount: number;
  budget?: number;
  isPublic: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// RSVP types
export interface Guest {
  name: string;
  relationship?: string;
  dietaryRestrictions?: string;
  mealPreference?: MealPreference;
}

export interface RSVP {
  id: string;
  wedding: string;
  invitedBy: string;
  guestEmail: string;
  guestName: string;
  status: RSVPStatus;
  totalGuests: number;
  additionalGuests?: Guest[];
  dietaryRestrictions?: string;
  mealPreference?: MealPreference;
  comments?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Session types
export interface Session {
  user: User;
  expiresAt: Date;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Statistics types
export interface WeddingStats {
  totalWeddings: number;
  totalRSVPs: number;
  acceptedRSVPs: number;
  declinedRSVPs: number;
  pendingRSVPs: number;
  totalGuests: number;
  respondedPercentage: number;
}
