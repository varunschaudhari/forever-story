const fs = require('fs');
const { MongoClient } = require('mongodb');

const env = fs.readFileSync('.env.local', 'utf8');
const mongoUri = env.match(/MONGODB_URI=(.*)/)?.[1];

async function check() {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db('forever-story');
    
    const wedding = await db.collection('weddings').findOne({ slug: 'sarah-michael' });
    console.log('Wedding:', JSON.stringify(wedding, null, 2));
    
    const user = await db.collection('users').findOne({ email: 'demo@foreverstory.com' });
    console.log('\nUser:', JSON.stringify(user, null, 2));
  } finally {
    await client.close();
  }
}

check();
