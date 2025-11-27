/**
 * Seed Script for Test Users
 *
 * This script creates test users for testing the friends feature.
 * Run with: npx ts-node scripts/seedUsers.ts
 *
 * All test users have the same password: "password123"
 * All test users will be friends with each other.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import User model
import User from '../src/models/User';

const testUsers = [
  {
    name: 'Alice Johnson',
    email: 'alice@test.com',
    password: 'password123',
    level: 5,
    xp: 450,
    totalTasksCompleted: 25
  },
  {
    name: 'Bob Smith',
    email: 'bob@test.com',
    password: 'password123',
    level: 3,
    xp: 280,
    totalTasksCompleted: 15
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@test.com',
    password: 'password123',
    level: 7,
    xp: 720,
    totalTasksCompleted: 42
  },
  {
    name: 'Diana Ross',
    email: 'diana@test.com',
    password: 'password123',
    level: 2,
    xp: 150,
    totalTasksCompleted: 8
  },
  {
    name: 'Edward King',
    email: 'edward@test.com',
    password: 'password123',
    level: 10,
    xp: 1200,
    totalTasksCompleted: 75
  },
  {
    name: 'Fiona Green',
    email: 'fiona@test.com',
    password: 'password123',
    level: 4,
    xp: 380,
    totalTasksCompleted: 20
  },
  {
    name: 'George Wilson',
    email: 'george@test.com',
    password: 'password123',
    level: 6,
    xp: 550,
    totalTasksCompleted: 32
  },
  {
    name: 'Hannah Davis',
    email: 'hannah@test.com',
    password: 'password123',
    level: 1,
    xp: 50,
    totalTasksCompleted: 3
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/lvl-ai';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    console.log('\n--- Cleaning Up Existing Test Users ---\n');

    // Delete existing test users
    const testEmails = testUsers.map(u => u.email);
    const deleteResult = await User.deleteMany({ email: { $in: testEmails } });
    console.log(`Deleted ${deleteResult.deletedCount} existing test users`);

    console.log('\n--- Creating Test Users ---\n');

    const createdUsers: mongoose.Types.ObjectId[] = [];

    for (const userData of testUsers) {
      // Create new user
      const user = await User.create(userData);
      console.log(`Created user: ${user.name} (${user.email}) - Level ${user.level}, XP ${user.xp}`);
      createdUsers.push(user._id as mongoose.Types.ObjectId);
    }

    console.log('\n--- Making All Users Friends ---\n');

    // Make all users friends with each other
    for (let i = 0; i < createdUsers.length; i++) {
      const userId = createdUsers[i];
      // Get all other user IDs (everyone except this user)
      const friendIds = createdUsers.filter((_, index) => index !== i);

      await User.findByIdAndUpdate(userId, {
        $set: { friends: friendIds }
      });
    }

    console.log(`Made all ${createdUsers.length} users friends with each other!`);

    console.log('\n--- Seed Complete ---\n');
    console.log('Test users created:');
    console.log('============================');
    testUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: password123`);
      console.log(`   Level: ${user.level}, XP: ${user.xp}`);
      console.log('');
    });

    console.log('All users are now friends with each other!');
    console.log('You can now login with any of these accounts to test the friends feature.');

  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the seed function
seedUsers();
