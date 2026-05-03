import mongoose, { Schema, Document, Types } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  role: 'customer' | 'partner' | 'admin';
  isProfilePublic: boolean;
  allowViewWeddingStories: boolean;
  referredBy?: Types.ObjectId;
  totalEarnings: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
    },
    role: {
      type: String,
      enum: ['customer', 'partner', 'admin'],
      default: 'customer',
    },
    isProfilePublic: {
      type: Boolean,
      default: true,
    },
    allowViewWeddingStories: {
      type: Boolean,
      default: true,
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (password: string) {
  return bcryptjs.compare(password, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
