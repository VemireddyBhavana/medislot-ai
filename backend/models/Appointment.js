const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  patientPhone: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  doctorName: { type: String, required: true },
  specialization: { type: String, required: true },
  appointmentDate: { type: String, required: true }, // YYYY-MM-DD
  appointmentTime: { type: String, required: true }, // HH:mm
  status: { 
    type: String, 
    enum: ['booked', 'completed', 'cancelled', 'no-show'], 
    default: 'booked' 
  },
  noShowRisk: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  priority: {
    type: String,
    enum: ['routine', 'follow-up', 'urgent'],
    default: 'routine'
  },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
