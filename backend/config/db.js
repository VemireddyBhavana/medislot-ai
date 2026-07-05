const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed default admin
    const adminExists = await Admin.findOne({ email: 'admin@medislot.ai' });
    if (!adminExists) {
      await Admin.create({
        name: 'Super Admin',
        email: 'admin@medislot.ai',
        password: 'password123'
      });
      console.log('Default admin seeded (admin@medislot.ai / password123)');
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
