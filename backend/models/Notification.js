const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['reminder', 'follow-up', 'alert'], 
    required: true 
  },
  sentAt: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'sent', 'failed'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
