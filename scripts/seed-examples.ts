import mongoose from 'mongoose';
import { User } from '@/models/User';
import { Wedding } from '@/models/Wedding';
import { Commission } from '@/models/Commission';
import fs from 'fs';
import path from 'path';

// Load .env.local
const envFile = fs.readFileSync(path.resolve('.env.local'), 'utf8');
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    process.env[key.trim()] = value.trim();
  }
});

async function seedExamples() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env.local');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Create or fetch admin
    let admin = await User.findOne({ email: 'admin@foreverstory.com' });
    if (!admin) {
      admin = await User.create({
        email: 'admin@foreverstory.com',
        password: 'AdminPassword123!',
        name: 'ForeverStory Admin',
        phone: '+1-800-ADMIN-1',
        role: 'admin',
      });
      console.log('✓ Admin created: admin@foreverstory.com');
    }

    // Create customers
    const customers = [];
    const customerData = [
      { email: 'sarah.michael@email.com', name: 'Sarah & Michael', phone: '+1-555-0101' },
      { email: 'emma.james@email.com', name: 'Emma & James', phone: '+1-555-0102' },
      { email: 'sophia.david@email.com', name: 'Sophia & David', phone: '+1-555-0103' },
      { email: 'olivia.chris@email.com', name: 'Olivia & Christopher', phone: '+1-555-0104' },
      { email: 'isabella.ryan@email.com', name: 'Isabella & Ryan', phone: '+1-555-0105' },
    ];

    for (const data of customerData) {
      let customer = await User.findOne({ email: data.email });
      if (!customer) {
        customer = await User.create({
          email: data.email,
          password: 'CustomerPassword123!',
          name: data.name,
          phone: data.phone,
          role: 'customer',
          totalEarnings: 0,
        });
        customers.push(customer);
        console.log(`✓ Customer created: ${data.name}`);
      } else {
        customers.push(customer);
      }
    }

    // Create partners
    const partners = [];
    const partnerData = [
      { email: 'partner.aisha@email.com', name: 'Aisha Wedding Planner', phone: '+1-555-0201', earnings: 2500 },
      { email: 'partner.raj@email.com', name: 'Raj Event Coordinator', phone: '+1-555-0202', earnings: 3200 },
      { email: 'partner.maya@email.com', name: 'Maya Designs', phone: '+1-555-0203', earnings: 1800 },
      { email: 'partner.james@email.com', name: 'James Photography', phone: '+1-555-0204', earnings: 4100 },
    ];

    for (const data of partnerData) {
      let partner = await User.findOne({ email: data.email });
      if (!partner) {
        partner = await User.create({
          email: data.email,
          password: 'PartnerPassword123!',
          name: data.name,
          phone: data.phone,
          role: 'partner',
          totalEarnings: data.earnings,
        });
        partners.push(partner);
        console.log(`✓ Partner created: ${data.name} (Earnings: ₹${data.earnings})`);
      } else {
        partners.push(partner);
      }
    }

    // Create example weddings - LEGACY TIER
    const legacyWeddings = [
      {
        groomName: 'Michael',
        brideName: 'Sarah',
        title: 'A Journey Together',
        description: 'From the moment we met, we knew we found something special.',
        slug: 'sarah-michael',
        organizers: [customers[0]?._id],
        date: new Date('2024-06-15'),
        venue: { name: 'The Grand Ballroom', address: '123 Wedding Lane', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
        guestCount: 150,
        isPublic: true,
        template: 'classic',
      },
    ];

    // PREMIUM TIER
    const premiumWeddings = [
      {
        groomName: 'James',
        brideName: 'Emma',
        title: 'Modern Love Story',
        description: 'Emma and James met at a tech conference in San Francisco.',
        slug: 'emma-james',
        organizers: [customers[1]?._id],
        createdBy: partners[0]?._id,
        date: new Date('2024-08-20'),
        venue: { name: 'Urban Loft & Gallery', address: '456 Modern Street', city: 'San Francisco', state: 'CA', zipCode: '94105', country: 'USA' },
        guestCount: 120,
        isPublic: true,
        template: 'modern',
      },
      {
        groomName: 'David',
        brideName: 'Sophia',
        title: 'Timeless Romance',
        description: 'Sophia and David\'s love story is one of devotion and grace.',
        slug: 'sophia-david',
        organizers: [customers[2]?._id],
        createdBy: partners[1]?._id,
        date: new Date('2024-09-28'),
        venue: { name: 'Enchanted Manor Estate', address: '789 Garden Path', city: 'Boston', state: 'MA', zipCode: '02101', country: 'USA' },
        guestCount: 180,
        isPublic: true,
        template: 'romantic',
      },
      {
        groomName: 'Christopher',
        brideName: 'Olivia',
        title: 'Beach Paradise Wedding',
        description: 'Olivia and Christopher\'s destination wedding on a pristine beach.',
        slug: 'olivia-chris-beach',
        organizers: [customers[3]?._id],
        createdBy: partners[2]?._id,
        date: new Date('2024-07-10'),
        venue: { name: 'Sunset Beach Resort', address: 'Beachfront Boulevard', city: 'Maui', state: 'HI', zipCode: '96761', country: 'USA' },
        guestCount: 95,
        isPublic: true,
        template: 'modern',
      },
    ];

    // PLATINUM TIER
    const platinumWeddings = [
      {
        groomName: 'Ryan',
        brideName: 'Isabella',
        title: 'Mountain Hideaway',
        description: 'Isabella and Ryan said "I do" surrounded by majestic mountains.',
        slug: 'isabella-ryan-mountain',
        organizers: [customers[4]?._id],
        createdBy: partners[3]?._id,
        date: new Date('2024-10-05'),
        venue: { name: 'Rocky Peak Lodge', address: '5000 Mountain Drive', city: 'Aspen', state: 'CO', zipCode: '81611', country: 'USA' },
        guestCount: 110,
        isPublic: true,
        template: 'classic',
      },
      {
        groomName: 'Thomas',
        brideName: 'Victoria',
        title: 'Garden Celebration',
        description: 'A romantic garden wedding filled with flowers and elegance.',
        slug: 'garden-wedding-2024',
        organizers: [customers[0]?._id],
        createdBy: partners[0]?._id,
        date: new Date('2025-05-20'),
        venue: { name: 'Botanical Gardens Estate', address: '1000 Flower Lane', city: 'Philadelphia', state: 'PA', zipCode: '19103', country: 'USA' },
        guestCount: 140,
        isPublic: false,
        template: 'romantic',
      },
    ];

    // Create all weddings
    const allWeddings = [...legacyWeddings, ...premiumWeddings, ...platinumWeddings];
    let createdWeddings = 0;
    const createdWeddingIds: { [key: string]: string } = {};

    for (const wedding of allWeddings) {
      if (wedding.organizers[0]) {
        const existing = await Wedding.findOne({ slug: wedding.slug });
        if (!existing) {
          const created = await Wedding.create(wedding);
          createdWeddingIds[wedding.slug] = created._id.toString();
          createdWeddings++;
          console.log(`✓ Story created: ${wedding.title}`);
        } else {
          createdWeddingIds[wedding.slug] = existing._id.toString();
        }
      }
    }

    // Create sample commissions
    const commissionData = [
      {
        partner: partners[0]?._id,
        customer: customers[0]?._id,
        weddingId: createdWeddingIds['sarah-michael'],
        type: 'direct',
        fixedAmount: 5,
        percentageAmount: 247.5,
        totalAmount: 252.5,
        weddingPrice: 1650,
        status: 'pending',
      },
      {
        partner: partners[0]?._id,
        customer: customers[1]?._id,
        weddingId: createdWeddingIds['emma-james'],
        type: 'referral',
        fixedAmount: 5,
        percentageAmount: 195,
        totalAmount: 200,
        weddingPrice: 1300,
        status: 'paid',
      },
      {
        partner: partners[1]?._id,
        customer: customers[2]?._id,
        weddingId: createdWeddingIds['sophia-david'],
        type: 'direct',
        fixedAmount: 5,
        percentageAmount: 292.5,
        totalAmount: 297.5,
        weddingPrice: 1950,
        status: 'pending',
      },
      {
        partner: partners[2]?._id,
        customer: customers[3]?._id,
        weddingId: createdWeddingIds['olivia-chris-beach'],
        type: 'direct',
        fixedAmount: 5,
        percentageAmount: 142.5,
        totalAmount: 147.5,
        weddingPrice: 950,
        status: 'pending',
      },
      {
        partner: partners[3]?._id,
        customer: customers[4]?._id,
        weddingId: createdWeddingIds['isabella-ryan-mountain'],
        type: 'referral',
        fixedAmount: 5,
        percentageAmount: 165,
        totalAmount: 170,
        weddingPrice: 1100,
        status: 'paid',
      },
    ];

    let createdCommissions = 0;
    for (const commission of commissionData) {
      if (commission.partner) {
        const existing = await Commission.findOne({
          partner: commission.partner,
          customer: commission.customer,
          type: commission.type,
        });
        if (!existing) {
          await Commission.create(commission);
          createdCommissions++;
          console.log(`✓ Commission created: ₹${commission.totalAmount.toFixed(2)} (${commission.status})`);
        }
      }
    }

    console.log('\n✓ Seeding completed!');
    console.log(`  - Customers: ${customers.length}`);
    console.log(`  - Partners: ${partners.length}`);
    console.log(`  - Stories created: ${createdWeddings}`);
    console.log(`  - Commissions created: ${createdCommissions}`);
    console.log('\n📋 Test Accounts:');
    console.log('  Admin:    admin@foreverstory.com / AdminPassword123!');
    console.log('  Customer: sarah.michael@email.com / CustomerPassword123!');
    console.log('  Partner:  partner.aisha@email.com / PartnerPassword123!');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error);
    process.exit(1);
  }
}

seedExamples();
