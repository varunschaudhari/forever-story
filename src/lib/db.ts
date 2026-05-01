import { User, IUser } from '@/models/User';
import { Wedding, IWedding } from '@/models/Wedding';
import { RSVP, IRSVP, RSVPStatus } from '@/models/RSVP';
import { PaginatedResponse } from '@/types';
import { Types } from 'mongoose';

// User operations
export async function getUserById(id: string | Types.ObjectId): Promise<IUser | null> {
  return User.findById(id);
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email: email.toLowerCase() });
}

export async function createUser(userData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}): Promise<IUser> {
  return User.create(userData);
}

export async function updateUser(
  id: string | Types.ObjectId,
  updates: Partial<IUser>
): Promise<IUser | null> {
  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  return user;
}

// Wedding operations
export async function getWeddingById(id: string | Types.ObjectId): Promise<IWedding | null> {
  return Wedding.findById(id).populate('organizers', 'name email avatar');
}

export async function getWeddingsByUser(
  userId: string | Types.ObjectId,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<IWedding>> {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Wedding.find({ organizers: userId })
      .populate('organizers', 'name email avatar')
      .skip(skip)
      .limit(limit)
      .sort({ date: 1 }),
    Wedding.countDocuments({ organizers: userId }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function createWedding(weddingData: Partial<IWedding>): Promise<IWedding> {
  return Wedding.create(weddingData);
}

export async function updateWedding(
  id: string | Types.ObjectId,
  updates: Partial<IWedding>
): Promise<IWedding | null> {
  const wedding = await Wedding.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).populate('organizers', 'name email avatar');

  return wedding;
}

export async function deleteWedding(id: string | Types.ObjectId): Promise<boolean> {
  const result = await Wedding.findByIdAndDelete(id);
  if (result) {
    // Also delete associated RSVPs
    await RSVP.deleteMany({ wedding: id });
    return true;
  }
  return false;
}

export async function getPublicWeddings(
  page = 1,
  limit = 10,
  filters?: { city?: string; tags?: string[] }
): Promise<PaginatedResponse<IWedding>> {
  const skip = (page - 1) * limit;
  const query: any = { isPublic: true };

  if (filters?.city) {
    query['venue.city'] = { $regex: filters.city, $options: 'i' };
  }

  if (filters?.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  const [data, total] = await Promise.all([
    Wedding.find(query)
      .populate('organizers', 'name email avatar')
      .skip(skip)
      .limit(limit)
      .sort({ date: 1 }),
    Wedding.countDocuments(query),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// RSVP operations
export async function getRSVPById(id: string | Types.ObjectId): Promise<IRSVP | null> {
  return RSVP.findById(id)
    .populate('wedding', 'title date venue')
    .populate('invitedBy', 'name email');
}

export async function getRSVPsByWedding(
  weddingId: string | Types.ObjectId,
  page = 1,
  limit = 20
): Promise<PaginatedResponse<IRSVP>> {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    RSVP.find({ wedding: weddingId })
      .populate('wedding', 'title date')
      .populate('invitedBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    RSVP.countDocuments({ wedding: weddingId }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getRSVPsByStatus(
  weddingId: string | Types.ObjectId,
  status: RSVPStatus,
  page = 1,
  limit = 20
): Promise<PaginatedResponse<IRSVP>> {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    RSVP.find({ wedding: weddingId, status })
      .populate('wedding', 'title date')
      .populate('invitedBy', 'name email')
      .skip(skip)
      .limit(limit),
    RSVP.countDocuments({ wedding: weddingId, status }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function createRSVP(rsvpData: Partial<IRSVP>): Promise<IRSVP> {
  return RSVP.create(rsvpData);
}

export async function updateRSVPStatus(
  id: string | Types.ObjectId,
  status: RSVPStatus,
  updates?: Partial<IRSVP>
): Promise<IRSVP | null> {
  const rsvp = await RSVP.findByIdAndUpdate(
    id,
    { status, ...updates },
    { new: true, runValidators: true }
  )
    .populate('wedding', 'title date')
    .populate('invitedBy', 'name email');

  return rsvp;
}

export async function getRSVPByEmailAndWedding(
  email: string,
  weddingId: string | Types.ObjectId
): Promise<IRSVP | null> {
  return RSVP.findOne({ guestEmail: email.toLowerCase(), wedding: weddingId })
    .populate('wedding', 'title date')
    .populate('invitedBy', 'name email');
}

// Statistics
export async function getWeddingStats(weddingId: string | Types.ObjectId) {
  const rsvps = await RSVP.find({ wedding: weddingId });

  const stats = {
    totalRSVPs: rsvps.length,
    accepted: rsvps.filter((r) => r.status === 'accepted').length,
    declined: rsvps.filter((r) => r.status === 'declined').length,
    pending: rsvps.filter((r) => r.status === 'pending').length,
    maybe: rsvps.filter((r) => r.status === 'maybe').length,
    totalGuests: rsvps.reduce((sum, r) => sum + r.totalGuests, 0),
    respondedCount: rsvps.filter((r) => r.respondedAt).length,
  };

  return {
    ...stats,
    respondedPercentage:
      stats.totalRSVPs > 0 ? Math.round((stats.respondedCount / stats.totalRSVPs) * 100) : 0,
  };
}
