import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWedding extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  organizers: Types.ObjectId[]; // User IDs
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

const weddingSchema = new Schema<IWedding>(
  {
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
    coverImage: {
      type: String,
    },
    date: {
      type: Date,
      required: [true, 'Please provide a wedding date'],
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: 'Wedding date must be in the future',
      },
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
weddingSchema.index({ 'venue.city': 1 });
weddingSchema.index({ tags: 1 });

export const Wedding =
  mongoose.models.Wedding || mongoose.model<IWedding>('Wedding', weddingSchema);
