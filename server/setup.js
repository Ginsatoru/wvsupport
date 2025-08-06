require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User'); // Your updated User model

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const adminExists = await User.findOne({ email: 'admin@wvsupport.com' });
    if (adminExists) {
      console.log('Admin user already exists:');
      console.log('Email: admin@wvsupport.com');
      console.log('Password: !@#aaapos'); // Change this in production!
      return;
    }

    const admin = new User({
      email: 'admin@wvsupport.com',
      password: '!@#aaapos', // Change this in production!
      isAdmin: true
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@wvsupport.com');
    console.log('Password: !@#aaapos');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
