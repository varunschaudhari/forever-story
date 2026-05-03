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

    // Find or create demo user
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
      { slug: 'sarah-michael', groomName: 'Michael', brideName: 'Sarah', title: 'A Journey Together', description: 'From the moment we met, we knew we found something special.', date: new Date('2024-06-15'), venue: { name: 'Grand Ballroom', address: '123 Lane', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' }, guestCount: 150 },
      { slug: 'emma-james', groomName: 'James', brideName: 'Emma', title: 'Modern Love Story', description: 'They met at a tech conference.', date: new Date('2024-08-20'), venue: { name: 'Urban Loft', address: '456 St', city: 'San Francisco', state: 'CA', zipCode: '94105', country: 'USA' }, guestCount: 120 },
      { slug: 'sophia-david', groomName: 'David', brideName: 'Sophia', title: 'Timeless Romance', description: 'A story of devotion and grace.', date: new Date('2024-09-28'), venue: { name: 'Manor Estate', address: '789 Rd', city: 'Boston', state: 'MA', zipCode: '02101', country: 'USA' }, guestCount: 180 },
    ];

    for (const ex of examples) {
      await weddingsCol.updateOne({ slug: ex.slug }, { $set: { ...ex, organizers: [user._id], isPublic: true } }, { upsert: true });
      console.log(`✓ ${ex.slug}`);
    }
  } finally {
    await client.close();
  }
}

seed().catch(e => { console.error(e); process.exit(1); });
