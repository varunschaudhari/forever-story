const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

// Load .env.local
const env = fs.readFileSync('.env.local', 'utf8');
const mongoUri = env.match(/MONGODB_URI=(.*)/)?.[1];

async function seed() {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    console.log('✓ Connected');
    
    const db = client.db('forever-story');
    const usersCol = db.collection('users');
    const weddingsCol = db.collection('weddings');

    // Find demo user
    let user = await usersCol.findOne({ email: 'demo@foreverstory.com' });
    if (!user) {
      const result = await usersCol.insertOne({
        email: 'demo@foreverstory.com',
        password: 'hashed',
        name: 'Demo',
        isProfilePublic: true,
        allowViewWeddingStories: true,
      });
      user = { _id: result.insertedId };
    }

    const examples = [
      {
        slug: 'sarah-michael',
        groomName: 'Michael',
        brideName: 'Sarah',
        title: 'A Journey Together',
        description: 'From the moment we met, we knew we found something special. Sarah captured my heart with her infectious laugh and kindness.',
        date: new Date('2024-06-15'),
        venue: {
          name: 'The Grand Ballroom',
          address: '123 Wedding Lane',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        guestCount: 150,
        isPublic: true,
        organizers: [user._id],
        events: [
          {
            name: 'Ceremony',
            type: 'ceremony',
            date: new Date('2024-06-15'),
            time: '14:00',
            location: 'The Grand Ballroom - Main Hall',
            description: 'Join us as we exchange our vows'
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'emma-james',
        groomName: 'James',
        brideName: 'Emma',
        title: 'Modern Love Story',
        description: 'Emma and James met at a tech conference and bonded over their shared passion for innovation and travel.',
        date: new Date('2024-08-20'),
        venue: {
          name: 'Urban Loft & Gallery',
          address: '456 Modern Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'USA'
        },
        guestCount: 120,
        isPublic: true,
        organizers: [user._id],
        events: [
          {
            name: 'Ceremony',
            type: 'ceremony',
            date: new Date('2024-08-20'),
            time: '16:00',
            location: 'Urban Loft & Gallery - Rooftop'
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'sophia-david',
        groomName: 'David',
        brideName: 'Sophia',
        title: 'Timeless Romance',
        description: 'Sophia and David\'s love story is one of devotion and grace. They believe in the beauty of tradition.',
        date: new Date('2024-09-28'),
        venue: {
          name: 'Enchanted Manor Estate',
          address: '789 Garden Path',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          country: 'USA'
        },
        guestCount: 180,
        isPublic: true,
        organizers: [user._id],
        events: [
          {
            name: 'Ceremony',
            type: 'ceremony',
            date: new Date('2024-09-28'),
            time: '15:00',
            location: 'Enchanted Manor Estate - Garden'
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Delete existing and recreate
    await weddingsCol.deleteMany({ slug: { $in: ['sarah-michael', 'emma-james', 'sophia-david'] } });

    for (const ex of examples) {
      const result = await weddingsCol.insertOne(ex);
      console.log(`✓ ${ex.slug}`);
    }

    // Verify
    const count = await weddingsCol.countDocuments({ slug: { $in: ['sarah-michael', 'emma-james', 'sophia-david'] } });
    console.log(`✓ ${count} examples in database`);
  } catch (e) {
    console.error('✗', e.message);
  } finally {
    await client.close();
  }
}

seed();
