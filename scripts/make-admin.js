const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function makeAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'admin@church.mn' },
      { $set: { role: 'admin' } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ User admin@church.mn is now an admin!');
    } else {
      console.log('⚠️ User not found or already admin');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();
