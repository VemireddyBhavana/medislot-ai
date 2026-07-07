const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed default admin
    const adminEmail = 'admin@medislot.ai';
    const adminPassword = 'medislot';

    // Clean up any other admins to keep only the one
    await Admin.deleteMany({ email: { $ne: adminEmail } });

    const adminExists = await Admin.findOne({ email: adminEmail });
    if (!adminExists) {
      await Admin.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword
      });
      console.log(`Default admin seeded (${adminEmail} / ${adminPassword})`);
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
