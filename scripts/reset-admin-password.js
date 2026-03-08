const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const NEW_PASSWORD = process.env.ADMIN_PASSWORD || process.argv[2];
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@church.mn';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable required');
  process.exit(1);
}

if (!NEW_PASSWORD) {
  console.error('❌ Password required');
  console.error('Usage: ADMIN_PASSWORD=xxx node reset-admin-password.js');
  console.error('   or: node reset-admin-password.js <password>');
  process.exit(1);
}

if (NEW_PASSWORD.length < 8) {
  console.error('❌ Password must be at least 8 characters');
  process.exit(1);
}

async function resetPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: ADMIN_EMAIL },
      { $set: { password: hashedPassword, role: 'admin' } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Password reset successful!');
      console.log('Email:', ADMIN_EMAIL);
    } else {
      console.log('⚠️ User not found:', ADMIN_EMAIL);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

resetPassword();
