const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

// Load env vars
dotenv.config({ path: '../.env' });

// Realistic Seed Data
const adminData = {
  name: 'Clinic Administrator',
  email: 'admin@medislot.ai',
  password: 'medislot'
};

const doctorsData = [
  {
    name: 'Dr. Sarah Jenkins',
    specialization: 'Cardiology',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    startTime: '09:00',
    endTime: '15:00',
    slotDuration: 30,
    fee: 150,
    roomNumber: '101-A',
    experienceYears: 12,
    isActive: true
  },
  {
    name: 'Dr. Robert Chen',
    specialization: 'Neurology',
    availableDays: ['Tuesday', 'Wednesday', 'Friday'],
    startTime: '10:00',
    endTime: '18:00',
    slotDuration: 45,
    fee: 200,
    roomNumber: '204-B',
    experienceYears: 18,
    isActive: true
  },
  {
    name: 'Dr. Emily Carter',
    specialization: 'Pediatrics',
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    startTime: '08:00',
    endTime: '14:00',
    slotDuration: 20,
    fee: 100,
    roomNumber: '105-A',
    experienceYears: 8,
    isActive: true
  },
  {
    name: 'Dr. Michael Rodriguez',
    specialization: 'Dermatology',
    availableDays: ['Thursday', 'Friday', 'Saturday'],
    startTime: '11:00',
    endTime: '19:00',
    slotDuration: 30,
    fee: 120,
    roomNumber: '302-C',
    experienceYears: 15,
    isActive: true
  },
  {
    name: 'Dr. Anita Patel',
    specialization: 'Orthopedics',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    fee: 160,
    roomNumber: '108-A',
    experienceYears: 22,
    isActive: true
  },
  {
    name: 'Dr. James Wilson',
    specialization: 'General Practice',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '08:30',
    endTime: '16:30',
    slotDuration: 15,
    fee: 80,
    roomNumber: '101-B',
    experienceYears: 5,
    isActive: true
  }
];

const generateAppointments = (doctors) => {
  const appointments = [];
  const patientNames = ['Alice Smith', 'Bob Johnson', 'Charlie Brown', 'Diana Prince', 'Evan Wright', 'Fiona Gallagher', 'George Miller', 'Hannah Abbott'];
  const dates = ['2026-07-06', '2026-07-07', '2026-07-08'];
  
  // Generate 15 appointments
  for (let i = 0; i < 15; i++) {
    const doctor = doctors[i % doctors.length];
    const patientName = patientNames[i % patientNames.length];
    
    let status = 'booked';
    let risk = 'low';
    if (i === 3 || i === 7) {
      status = 'no-show';
      risk = 'high';
    } else if (i === 1 || i === 9) {
      status = 'completed';
    } else if (i === 5) {
      status = 'cancelled';
      risk = 'medium';
    }

    let priority = 'routine';
    if (i % 4 === 0) priority = 'follow-up';
    if (i % 7 === 0) priority = 'urgent';

    let reason = 'AI Risk Factors: Stable booking metrics.';
    if (risk === 'high') {
      reason = 'AI Risk Factors: Far-future booking date (>7 days out), Early morning slot.';
    } else if (risk === 'medium') {
      reason = 'AI Risk Factors: Moderate booking buffer (>3 days out).';
    }

    appointments.push({
      patientName,
      patientEmail: `${patientName.split(' ')[0].toLowerCase()}@example.com`,
      patientPhone: `+1-555-01${i.toString().padStart(2, '0')}`,
      doctorId: doctor._id,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      appointmentDate: dates[i % dates.length],
      appointmentTime: `${10 + (i % 5)}:00`, // times between 10:00 and 15:00
      status,
      noShowRisk: risk,
      noShowReason: reason,
      priority,
      notes: priority === 'urgent' ? 'Patient reported severe symptoms' : 'Regular checkup'
    });
  }
  return appointments;
};

const generateNotifications = (appointments) => {
  return appointments
    .filter(a => a.status === 'booked' || a.status === 'no-show')
    .map((app, i) => ({
      appointmentId: app._id,
      message: app.status === 'no-show' ? `Missed appointment for ${app.patientName}. Please reschedule.` : `Reminder: Appointment tomorrow at ${app.appointmentTime} with ${app.doctorName}`,
      type: app.status === 'no-show' ? 'alert' : 'reminder',
      status: app.status === 'no-show' ? 'pending' : 'sent',
      sentAt: app.status === 'no-show' ? null : new Date()
    }));
};

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/medislot';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await Admin.deleteMany();
    await Doctor.deleteMany();
    await Appointment.deleteMany();
    await Notification.deleteMany();
    console.log('Previous data cleared.');

    // Seed Admin
    await Admin.create(adminData);
    
    // Seed Doctors
    const createdDoctors = await Doctor.insertMany(doctorsData);
    
    // Seed Appointments
    const appointmentsData = generateAppointments(createdDoctors);
    const createdAppointments = await Appointment.insertMany(appointmentsData);

    // Seed Notifications
    const notificationsData = generateNotifications(createdAppointments);
    await Notification.insertMany(notificationsData);

    console.log('Data Imported Successfully!');
    console.log('- 1 Admin Account');
    console.log(`- ${createdDoctors.length} Doctors`);
    console.log(`- ${createdAppointments.length} Appointments`);
    console.log(`- ${notificationsData.length} Notifications`);
    
    process.exit();
  } catch (error) {
    console.error(`Error with seeder: ${error.message}`);
    process.exit(1);
  }
};

seedData();
