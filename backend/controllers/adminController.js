const Admin = require('../models/Admin');

// @route   POST /api/admin/register
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if exists
    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ message: 'Admin already exists' });

    // In a real app, hash password here using bcrypt
    admin = new Admin({ name, email, password });
    await admin.save();
    
    res.status(201).json({ message: 'Admin registered successfully', admin: { id: admin._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @route   POST /api/admin/login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    
    // In a real app, use bcrypt.compare
    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({ message: 'Login successful', token: 'sample_jwt_token', admin: { id: admin._id, name: admin.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
