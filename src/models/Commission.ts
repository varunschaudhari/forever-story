import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICommission extends Document {
  partner: Types.ObjectId;
  weddingId: Types.ObjectId;
  customer: Types.ObjectId;
  type: 'direct' | 'referral';
  fixedAmount: number;
  percentageAmount: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  weddingPrice: number;
  createdAt: Date;
  paidAt?: Date;
}

const commissionSchema = new Schema<ICommission>(
  {
    partner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Partner is required'],
    },
    weddingId: {
      type: Schema.Types.ObjectId,
      ref: 'Wedding',
      required: [true, 'Wedding ID is required'],
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },
    type: {
      type: String,
      enum: ['direct', 'referral'],
      default: 'direct',
    },
    fixedAmount: {
      type: Number,
      default: 5,
    },
    percentageAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending',
    },
    weddingPrice: {
      type: Number,
      default: 0,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

commissionSchema.index({ partner: 1, status: 1 });
commissionSchema.index({ weddingId: 1 });
commissionSchema.index({ customer: 1 });

export const Commission =
  mongoose.models.Commission ||
  mongoose.model<ICommission>('Commission', commissionSchema);
