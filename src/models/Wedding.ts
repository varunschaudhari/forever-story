import mongoose, { Schema, Document, Types } from 'mongoose';
import '@/models/User'; // Ensure User model is registered for populate

export interface IEvent {
  name: string;
  type: string; // 'ceremony', 'reception', 'dinner', 'party', 'custom'
  date: Date;
  time: string; // HH:mm format
  location?: string;
  description?: string;
}

export interface IContact {
  name: string;
  relationship?: string; // 'groom', 'bride', 'family', 'friend', 'vendor'
  phone?: string;
  email?: string;
}

export interface IWedding extends Document {
  _id: Types.ObjectId;
  slug: string; // Unique wedding slug
  groomName: string;
  brideName: string;
  title: string;
  description?: string;
  organizers: Types.ObjectId[]; // User IDs
  createdBy?: Types.ObjectId; // Partner who created this wedding
  coverImage?: string;
  date: Date;
  storyType: 'wedding' | 'engagement' | 'bridal_shower'; // Type of celebration
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
  events?: IEvent[];
  gallery?: string[]; // Array of image URLs
  contacts?: IContact[];
  guestCount: number;
  budget?: number;
  isPublic: boolean;
  tags?: string[];
  template?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['ceremony', 'reception', 'dinner', 'party', 'custom'],
      required: [true, 'Event type is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      match: [/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm format'],
    },
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  { _id: false }
);

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
    },
    relationship: {
      type: String,
      enum: ['groom', 'bride', 'family', 'friend', 'vendor'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        'Please provide a valid phone number',
      ],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
  },
  { _id: false }
);

const weddingSchema = new Schema<IWedding>(
  {
    slug: {
      type: String,
      required: [true, 'Wedding slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'],
    },
    groomName: {
      type: String,
      required: [true, 'Groom name is required'],
      trim: true,
    },
    brideName: {
      type: String,
      required: [true, 'Bride name is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a wedding title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    organizers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    coverImage: {
      type: String,
    },
    storyType: {
      type: String,
      enum: ['wedding', 'engagement', 'bridal_shower'],
      default: 'wedding',
      required: true,
    },
    events: [eventSchema],
    gallery: [
      {
        type: String,
        trim: true,
      },
    ],
    contacts: [contactSchema],
    date: {
      type: Date,
      required: [true, 'Please provide a wedding date'],
    },
    venue: {
      name: {
        type: String,
        required: [true, 'Please provide venue name'],
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'Please provide venue address'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'Please provide city'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'Please provide state'],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, 'Please provide zip code'],
        trim: true,
      },
      country: {
        type: String,
        required: [true, 'Please provide country'],
        trim: true,
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    guestCount: {
      type: Number,
      default: 0,
      min: [0, 'Guest count cannot be negative'],
    },
    budget: {
      type: Number,
      min: [0, 'Budget cannot be negative'],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    template: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

weddingSchema.index({ organizers: 1 });
weddingSchema.index({ date: 1 });
weddingSchema.index({ isPublic: 1 });
weddingSchema.index({ storyType: 1 });
weddingSchema.index({ 'venue.city': 1 });
weddingSchema.index({ tags: 1 });

export const Wedding =
  mongoose.models.Wedding || mongoose.model<IWedding>('Wedding', weddingSchema);
