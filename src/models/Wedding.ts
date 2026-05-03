import mongoose, { Schema, Document, Types } from 'mongoose';
import '@/models/User'; // Ensure User model is registered for populate

export interface MultiLangString {
  en: string;
  mr: string; // Marathi
  hi: string; // Hindi
}

export interface IParents {
  fatherName: string;
  motherName: string;
}

export interface ICeremony {
  name: 'Sakarpuda' | 'Haldi' | 'Mehendi' | 'Vivah';
  enabled: boolean;
  date?: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  city?: string;
}

export interface IGalleryAlbum {
  albumName: string;
  photos: string[];
}

export interface ISocialLinks {
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

export interface ITheme {
  themeId: string;
  fontStyle: 'serif' | 'sans';
}

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
  groomName: MultiLangString;
  brideName: MultiLangString;
  title: MultiLangString;
  description?: string;
  organizers: Types.ObjectId[]; // User IDs
  createdBy?: Types.ObjectId; // Partner who created this wedding
  photos?: {
    cover?: string;
    groom?: string;
    bride?: string;
    couple?: string;
  };
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
  groomParents?: IParents;
  brideParents?: IParents;
  ceremonies?: ICeremony[];
  events?: IEvent[];
  galleryAlbums?: IGalleryAlbum[];
  contacts?: IContact[];
  socialLinks?: ISocialLinks;
  theme?: ITheme;
  guestCount: number;
  budget?: number;
  isPublic: boolean;
  tags?: string[];
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

const multiLangStringSchema = new Schema<MultiLangString>(
  {
    en: { type: String, required: true, trim: true },
    mr: { type: String, required: true, trim: true },
    hi: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const parentsSchema = new Schema<IParents>(
  {
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
  },
  { _id: false }
);

const ceremonySchema = new Schema<ICeremony>(
  {
    name: { type: String, enum: ['Sakarpuda', 'Haldi', 'Mehendi', 'Vivah'], required: true },
    enabled: { type: Boolean, default: false },
    date: String,
    startTime: String,
    endTime: String,
    address: String,
    city: String,
  },
  { _id: false }
);

const galleryAlbumSchema = new Schema<IGalleryAlbum>(
  {
    albumName: { type: String, trim: true },
    photos: [{ type: String }],
  },
  { _id: false }
);

const socialLinksSchema = new Schema<ISocialLinks>(
  {
    whatsapp: String,
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String,
  },
  { _id: false }
);

const themeSchema = new Schema<ITheme>(
  {
    themeId: String,
    fontStyle: { type: String, enum: ['serif', 'sans'] },
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
    groomName: multiLangStringSchema,
    brideName: multiLangStringSchema,
    title: multiLangStringSchema,
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
    photos: {
      cover: String,
      groom: String,
      bride: String,
      couple: String,
    },
    storyType: {
      type: String,
      enum: ['wedding', 'engagement', 'bridal_shower'],
      default: 'wedding',
      required: true,
    },
    groomParents: parentsSchema,
    brideParents: parentsSchema,
    ceremonies: [ceremonySchema],
    events: [eventSchema],
    galleryAlbums: [galleryAlbumSchema],
    contacts: [contactSchema],
    socialLinks: socialLinksSchema,
    theme: themeSchema,
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
