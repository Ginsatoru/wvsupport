require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function finalFix() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Delete all users
    await User.deleteMany({});
    
    // Create admin with new password: !@#aaapos
    // Plain text here — the User model's pre-save hook hashes it
    await User.create({
      email: 'admin@wvsupport.com',
      password: '!@#aaapos',
      isAdmin: true
    });
    
    console.log('✅ Admin created with verified credentials:');
    console.log('Email: admin@wvsupport.com');
    console.log('Password: !@#aaapos');
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    mongoose.disconnect();
  }
}

finalFix();