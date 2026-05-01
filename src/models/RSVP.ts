import mongoose, { Schema, Document, Types } from 'mongoose';

export type RSVPStatus = 'pending' | 'accepted' | 'declined' | 'maybe';
export type MealPreference = 'vegetarian' | 'vegan' | 'non-vegetarian' | 'no-preference';

export interface IGuest {
  name: string;
  relationship?: string;
  dietaryRestrictions?: string;
  mealPreference?: MealPreference;
}

export interface IRSVP extends Document {
  _id: Types.ObjectId;
  wedding: Types.ObjectId;
  invitedBy: Types.ObjectId; // User who invited
  guestEmail: string;
  guestName: string;
  status: RSVPStatus;
  totalGuests: number;
  additionalGuests?: IGuest[];
  dietaryRestrictions?: string;
  mealPreference?: MealPreference;
  comments?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const guestSchema = new Schema<IGuest>(
  {
    name: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
    },
    relationship: {
      type: String,
      trim: true,
      enum: {
        values: ['friend', 'family', 'colleague', 'other'],
        message: 'Invalid relationship type',
      },
    },
    dietaryRestrictions: {
      type: String,
      trim: true,
    },
    mealPreference: {
      type: String,
      enum: {
        values: ['vegetarian', 'vegan', 'non-vegetarian', 'no-preference'],
        message: 'Invalid meal preference',
      },
      default: 'no-preference',
    },
  },
  { _id: false }
);

const rsvpSchema = new Schema<IRSVP>(
  {
    wedding: {
      type: Schema.Types.ObjectId,
      ref: 'Wedding',
      required: [true, 'Wedding ID is required'],
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Inviter ID is required'],
    },
    guestEmail: {
      type: String,
      required: [true, 'Guest email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'declined', 'maybe'],
        message: 'Invalid RSVP status',
      },
      default: 'pending',
    },
    totalGuests: {
      type: Number,
      default: 1,
      min: [1, 'At least one guest must be included'],
      max: [10, 'Maximum 10 guests per RSVP'],
    },
    additionalGuests: [guestSchema],
    dietaryRestrictions: {
      type: String,
      trim: true,
      maxlength: [500, 'Dietary restrictions cannot exceed 500 characters'],
    },
    mealPreference: {
      type: String,
      enum: {
        values: ['vegetarian', 'vegan', 'non-vegetarian', 'no-preference'],
        message: 'Invalid meal preference',
      },
      default: 'no-preference',
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comments cannot exceed 1000 characters'],
    },
    respondedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to set respondedAt when status changes from pending
rsvpSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status !== 'pending' && !this.respondedAt) {
    this.respondedAt = new Date();
  }
  next();
});

// Indexes for efficient querying
rsvpSchema.index({ wedding: 1, status: 1 });
rsvpSchema.index({ wedding: 1, guestEmail: 1 }, { unique: true });
rsvpSchema.index({ invitedBy: 1 });
rsvpSchema.index({ status: 1 });
rsvpSchema.index({ respondedAt: 1 });

export const RSVP =
  mongoose.models.RSVP || mongoose.model<IRSVP>('RSVP', rsvpSchema);
