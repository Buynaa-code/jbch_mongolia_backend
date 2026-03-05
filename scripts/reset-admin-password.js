const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const NEW_PASSWORD = 'Admin12345';

async function resetPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'admin@church.mn' },
      { $set: { password: hashedPassword, role: 'admin' } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Password reset successful!');
      console.log('Email: admin@church.mn');
      console.log('Password: ' + NEW_PASSWORD);
    } else {
      console.log('⚠️ User not found');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

resetPassword();
