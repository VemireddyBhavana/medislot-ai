const Hospital = require('../models/Hospital');

const mockHospitals = [
  {
    name: "City General Hospital",
    address: "123 Medical Center Blvd, Downtown",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800",
    contactNumber: "+1-555-0100",
    email: "info@citygeneral.com",
    location: {
      type: "Point",
      coordinates: [-74.0060, 40.7128] // Example: New York longitude, latitude
    },
    amenities: ["Emergency Room", "ICU", "Parking", "Pharmacy", "Cafeteria"],
    rating: 4.8,
    reviews: 1250
  },
  {
    name: "Sunrise Memorial Clinic",
    address: "456 Sunrise Ave, Westside",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    contactNumber: "+1-555-0101",
    email: "contact@sunrisememorial.com",
    location: {
      type: "Point",
      coordinates: [-73.9851, 40.7589]
    },
    amenities: ["Outpatient Services", "Lab Testing", "Pharmacy", "Wheelchair Access"],
    rating: 4.6,
    reviews: 840
  },
  {
    name: "Lakeside Medical Center",
    address: "789 Lakeview Dr, Eastside",
    image: "https://images.unsplash.com/photo-1538108149393-cebb47acdd4e?auto=format&fit=crop&q=80&w=800",
    contactNumber: "+1-555-0102",
    email: "hello@lakesidemedical.com",
    location: {
      type: "Point",
      coordinates: [-73.9654, 40.7829]
    },
    amenities: ["Emergency Room", "Maternity Ward", "Pediatrics", "Parking"],
    rating: 4.9,
    reviews: 2100
  },
  {
    name: "Green Valley Health",
    address: "321 Valley Road, North Hills",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
    contactNumber: "+1-555-0103",
    email: "support@greenvalleyhealth.com",
    location: {
      type: "Point",
      coordinates: [-73.9510, 40.8000]
    },
    amenities: ["Physical Therapy", "Radiology", "Cafeteria"],
    rating: 4.5,
    reviews: 620
  },
  {
    name: "Metro Wellness Institute",
    address: "654 Metro Plaza, South District",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
    contactNumber: "+1-555-0104",
    email: "info@metrowellness.com",
    location: {
      type: "Point",
      coordinates: [-74.0150, 40.7050]
    },
    amenities: ["Holistic Care", "Nutrition Counseling", "Yoga Studio", "Pharmacy"],
    rating: 4.7,
    reviews: 930
  }
];

const seedHospitals = async () => {
  try {
    const count = await Hospital.countDocuments();
    if (count === 0) {
      console.log('Seeding mock hospitals into database...');
      await Hospital.insertMany(mockHospitals);
      console.log('Mock hospitals seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding hospitals:', error);
  }
};

module.exports = seedHospitals;
