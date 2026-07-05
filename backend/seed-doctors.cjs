const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  experienceYears: { type: Number, required: true },
  fee: { type: Number, required: true },
  availableDays: [{ type: String }],
  startTime: { type: String },
  endTime: { type: String },
  image: { type: String }
});

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);

const doctors = [
  {
    name: 'Dr. Arjun Mehta',
    specialization: 'Cardiologist',
    experienceYears: 5,
    fee: 800,
    availableDays: ['Mon', 'Tue', 'Wed', 'Fri'],
    startTime: '10:00 AM',
    endTime: '05:00 PM',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    name: 'Dr. Priya Sharma',
    specialization: 'Dermatologist',
    experienceYears: 6,
    fee: 600,
    availableDays: ['Mon', 'Wed', 'Thu', 'Sat'],
    startTime: '11:00 AM',
    endTime: '06:00 PM',
    image: 'https://images.unsplash.com/photo-1594824436998-ddf10cc0c1cb?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    name: 'Dr. Rahul Verma',
    specialization: 'Neurologist',
    experienceYears: 10,
    fee: 1000,
    availableDays: ['Tue', 'Wed', 'Fri', 'Sat'],
    startTime: '09:00 AM',
    endTime: '04:00 PM',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    name: 'Dr. Neha Kapoor',
    specialization: 'Pediatrician',
    experienceYears: 7,
    fee: 700,
    availableDays: ['Mon to Sat'],
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    name: 'Dr. Sameer Khan',
    specialization: 'Orthopedic',
    experienceYears: 8,
    fee: 800,
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    startTime: '10:00 AM',
    endTime: '05:00 PM',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    name: 'Dr. Anjali Desai',
    specialization: 'Gynecologist',
    experienceYears: 8,
    fee: 700,
    availableDays: ['Mon to Sat'],
    startTime: '11:00 AM',
    endTime: '05:00 PM',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=150&h=150'
  }
];

mongoose.connect('mongodb://localhost:27017/medislot').then(async () => {
  await Doctor.deleteMany({});
  await Doctor.insertMany(doctors);
  console.log('Seeded exact doctors from the screenshot!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
