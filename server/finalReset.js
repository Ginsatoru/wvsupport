require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function finalFix() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Delete all users
    await User.deleteMany({});
    
    // Create admin with new password: !@#aaapos
    await User.create({
      email: 'admin@wvsupport.com',
      password: '$2b$12$K4nDYi8YB/NolSCG1cW0h.YyFCUsb/8.BCT1KhMlL0wQb1eTS1vaC', // Hash for !@#aaapos
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
