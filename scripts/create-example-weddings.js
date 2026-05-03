const mongoose = require('mongoose');

const weddingSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true, required: true },
  description: String,
  groomName: String,
  brideName: String,
  date: Date,
  venue: {
    name: String,
    address: String,
    city: String,
  },
  isPublic: Boolean,
  organizers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  guestCount: Number,
  budget: Number,
  tags: [String],
});

const Wedding = mongoose.model('Wedding', weddingSchema);

async function createExampleWeddings() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI not set in .env.local');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Delete existing example weddings
    await Wedding.deleteMany({
      slug: { $in: ['sarah-michael', 'emma-james', 'sophia-david'] },
    });
    console.log('Deleted existing example weddings');

    // Create example weddings
    const weddings = await Wedding.insertMany([
      {
        title: 'Sarah & Michael - A Journey Together',
        slug: 'sarah-michael',
        description:
          'From the moment we met, we knew we found something special. Sarah captured my heart with her infectious laugh and kindness.',
        groomName: 'Michael',
        brideName: 'Sarah',
        date: new Date('2024-06-15'),
        venue: {
          name: 'The Grand Estate',
          address: '123 Ocean View Drive',
          city: 'Bali',
          state: 'Bali',
          zipCode: '80361',
          country: 'Indonesia',
        },
        isPublic: true,
        guestCount: 120,
        budget: 45000,
        tags: ['elegant', 'romantic', 'beach'],
      },
      {
        title: 'Emma & James - Modern Love',
        slug: 'emma-james',
        description:
          'Two hearts, one vision, endless possibilities. Emma and James celebrate their love with style and grace.',
        groomName: 'James',
        brideName: 'Emma',
        date: new Date('2024-08-22'),
        venue: {
          name: 'Skyline Rooftop Venue',
          address: '456 5th Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10018',
          country: 'USA',
        },
        isPublic: true,
        guestCount: 150,
        budget: 65000,
        tags: ['modern', 'urban', 'chic'],
      },
      {
        title: 'Sophia & David - Parisian Dreams',
        slug: 'sophia-david',
        description:
          'In the city of love, two souls found their perfect match. Sophia and David share their magical moment with those they cherish most.',
        groomName: 'David',
        brideName: 'Sophia',
        date: new Date('2024-09-10'),
        venue: {
          name: 'Chateau de Versailles',
          address: '1 Rue de l\'Indépendance Américaine',
          city: 'Paris',
          state: 'Île-de-France',
          zipCode: '78000',
          country: 'France',
        },
        isPublic: true,
        guestCount: 180,
        budget: 80000,
        tags: ['romantic', 'classic', 'elegant'],
      },
    ]);

    console.log(`Created ${weddings.length} example weddings:`);
    weddings.forEach((w) => {
      console.log(`  - ${w.title} (${w.slug})`);
    });

    await mongoose.connection.close();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createExampleWeddings();
