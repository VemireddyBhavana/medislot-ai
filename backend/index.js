const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to database
// connectDB(); // Uncomment when MongoDB is running locally

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data
let doctors = [
  { id: 1, name: 'Dr. Abdul Moied Mohammed', spec: 'Hernia Specialist', rating: 4.5, exp: 19 },
  { id: 2, name: 'Dr. P. Thrivikrama Rao', spec: 'Hernia Specialist', rating: 4.9, exp: 12 },
  { id: 3, name: 'Dr. V Ranjith Kumar Kota', spec: 'Hernia Specialist', rating: 4.7, exp: 12 }
];

let appointments = [];
let availableSlots = [
  { id: 101, doctorId: 1, date: '2026-07-06', time: '10:00 AM', basePrice: 500, dynamicMultiplier: 1.0 },
  { id: 102, doctorId: 1, date: '2026-07-06', time: '11:00 AM', basePrice: 500, dynamicMultiplier: 1.0 },
  { id: 103, doctorId: 2, date: '2026-07-06', time: '02:00 PM', basePrice: 600, dynamicMultiplier: 1.2 }, // High demand time
];

let rooms = [
  { id: 'OT-1', name: 'Operating Theater 1', isBooked: false },
  { id: 'OT-2', name: 'Operating Theater 2', isBooked: false },
];

// --- ROUTES ---

// Patient API: Get Available Slots
app.get('/api/slots', (req, res) => {
  // Map slots with doctor info
  const enrichedSlots = availableSlots.map(slot => {
    const doc = doctors.find(d => d.id === slot.doctorId);
    return { ...slot, doctorName: doc ? doc.name : 'Unknown' };
  });
  res.json(enrichedSlots);
});

// Patient API: Book Appointment
app.post('/api/appointments', (req, res) => {
  const { patientName, patientPhone, slotId } = req.body;
  const slotIndex = availableSlots.findIndex(s => s.id === slotId);
  
  if (slotIndex === -1) {
    return res.status(400).json({ error: 'Slot unavailable' });
  }

  const slot = availableSlots[slotIndex];
  
  const newAppointment = {
    id: Date.now(),
    patientName,
    patientPhone,
    slot,
    status: 'Confirmed'
  };

  appointments.push(newAppointment);
  
  // Remove slot from availability (Capacity Optimization)
  availableSlots.splice(slotIndex, 1);

  // Mock Notification Trigger
  console.log(`[NOTIFICATION SYSTEM] Sending SMS to ${patientPhone}: "Hi ${patientName}, your appointment is confirmed for ${slot.date} at ${slot.time}."`);

  res.status(201).json(newAppointment);
});

// Admin API: Get all appointments
app.get('/api/admin/appointments', (req, res) => {
  res.json(appointments);
});

// Admin API: Resource Reservation (Book a Room)
app.post('/api/admin/reserve-room', (req, res) => {
  const { roomId } = req.body;
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) return res.status(404).json({ error: 'Room not found' });
  if (room.isBooked) return res.status(400).json({ error: 'Room already booked' });

  room.isBooked = true;
  res.json({ message: `Room ${roomId} successfully reserved.` });
});

// Admin API: Get Rooms
app.get('/api/admin/rooms', (req, res) => {
  res.json(rooms);
});

app.listen(PORT, () => {
  console.log(`Medislotai Scheduling Server running on port ${PORT}`);
});
