import { dbConnect } from './mongodb';
import { User } from '@/models/User';
import { Wedding } from '@/models/Wedding';
import { RSVP } from '@/models/RSVP';

async function seedDatabase() {
  try {
    await dbConnect();

    // Clear existing data
    await User.deleteMany({});
    await Wedding.deleteMany({});
    await RSVP.deleteMany({});

    console.log('Database cleared');

    // Create sample users
    const users = await User.create([
      {
        name: 'John Smith',
        email: 'john@example.com',
        password: 'password123',
        phone: '+1-555-0101',
        bio: 'Wedding photographer and planner',
      },
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        phone: '+1-555-0102',
        bio: 'Love planning events',
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        phone: '+1-555-0103',
      },
      {
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        password: 'password123',
        phone: '+1-555-0104',
      },
    ]);

    console.log(`Created ${users.length} users`);

    // Create sample weddings
    const weddings = await Wedding.create([
      {
        title: 'John & Sarah Wedding',
        description: 'A beautiful wedding celebration in the heart of the city',
        organizers: [users[0]._id],
        date: new Date('2024-06-15'),
        venue: {
          name: 'Grand Ballroom',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          coordinates: {
            latitude: 40.7128,
            longitude: -74.006,
          },
        },
        guestCount: 150,
        budget: 50000,
        isPublic: true,
        tags: ['summer', 'romantic', 'city'],
      },
      {
        title: 'Mike & Emily Wedding',
        description: 'Outdoor garden wedding with friends and family',
        organizers: [users[1]._id],
        date: new Date('2024-07-20'),
        venue: {
          name: 'Riverside Gardens',
          address: '456 Garden Lane',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'USA',
          coordinates: {
            latitude: 37.7749,
            longitude: -122.4194,
          },
        },
        guestCount: 100,
        budget: 35000,
        isPublic: true,
        tags: ['garden', 'outdoor', 'summer'],
      },
      {
        title: 'Private Wedding',
        description: 'Intimate family gathering',
        organizers: [users[2]._id],
        date: new Date('2024-08-10'),
        venue: {
          name: 'Sunset Manor',
          address: '789 Elm Street',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA',
        },
        guestCount: 50,
        budget: 20000,
        isPublic: false,
        tags: ['intimate', 'family'],
      },
    ]);

    console.log(`Created ${weddings.length} weddings`);

    // Create sample RSVPs
    const rsvps = await RSVP.create([
      {
        wedding: weddings[0]._id,
        invitedBy: users[0]._id,
        guestEmail: 'guest1@example.com',
        guestName: 'Guest One',
        status: 'accepted',
        totalGuests: 2,
        mealPreference: 'vegetarian',
        additionalGuests: [
          {
            name: 'Plus One',
            relationship: 'friend',
            mealPreference: 'non-vegetarian',
          },
        ],
        comments: 'Looking forward to the celebration!',
        respondedAt: new Date(),
      },
      {
        wedding: weddings[0]._id,
        invitedBy: users[0]._id,
        guestEmail: 'guest2@example.com',
        guestName: 'Guest Two',
        status: 'declined',
        totalGuests: 1,
        mealPreference: 'vegan',
        comments: 'Unfortunately have a prior commitment',
        respondedAt: new Date(),
      },
      {
        wedding: weddings[0]._id,
        invitedBy: users[0]._id,
        guestEmail: 'guest3@example.com',
        guestName: 'Guest Three',
        status: 'pending',
        totalGuests: 1,
      },
      {
        wedding: weddings[1]._id,
        invitedBy: users[1]._id,
        guestEmail: 'guest4@example.com',
        guestName: 'Guest Four',
        status: 'accepted',
        totalGuests: 3,
        mealPreference: 'non-vegetarian',
        additionalGuests: [
          {
            name: 'Plus One A',
            relationship: 'family',
            mealPreference: 'vegetarian',
          },
          {
            name: 'Plus One B',
            relationship: 'family',
            mealPreference: 'no-preference',
          },
        ],
        dietaryRestrictions: 'Nut allergy',
        respondedAt: new Date(),
      },
      {
        wedding: weddings[1]._id,
        invitedBy: users[1]._id,
        guestEmail: 'guest5@example.com',
        guestName: 'Guest Five',
        status: 'maybe',
        totalGuests: 1,
        mealPreference: 'no-preference',
        comments: 'Waiting to confirm schedule',
        respondedAt: new Date(),
      },
    ]);

    console.log(`Created ${rsvps.length} RSVPs`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seed if executed directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

export default seedDatabase;
