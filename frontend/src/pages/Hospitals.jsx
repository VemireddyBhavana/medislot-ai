import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Star, Phone, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';
import { getNearbyHospitals } from '../api/services';

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // If we have coordinates stored in sessionStorage from Home page, use them
    const storedLat = sessionStorage.getItem('userLat');
    const storedLng = sessionStorage.getItem('userLng');

    if (storedLat && storedLng) {
      fetchHospitals(storedLat, storedLng);
    } else {
      // Fallback to fetch all hospitals if no location
      fetchHospitals();
      setLocationError("Location not provided. Showing all available hospitals.");
    }
  }, []);

  const fetchHospitals = async (lat, lng) => {
    try {
      setLoading(true);
      const data = await getNearbyHospitals(lat, lng);
      setHospitals(data);
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-blue-600 pt-16 pb-24 text-white text-center">
        <PageContainer>
          <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold mb-6 border border-blue-400">
            <Activity size={14} />
            Network of Care
          </div>
          <h1 className="text-4xl font-bold mb-4">Select a Hospital</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            {locationError 
              ? "Showing all partnered hospitals across our network."
              : "Here are the top-rated hospitals near your current location."}
          </p>
        </PageContainer>
      </div>

      <PageContainer>
        <div className="-mt-12 bg-white rounded-2xl shadow-lg border border-slate-100 p-8 min-h-[500px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {hospitals.length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-500">
                  <p>No hospitals found nearby.</p>
                </div>
              ) : (
                hospitals.map(hospital => (
                  <motion.div key={hospital._id} variants={fadeInUp} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col">
                    <img 
                      src={hospital.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"} 
                      alt={hospital.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{hospital.name}</h3>
                        <div className="flex items-center bg-blue-50 px-2 py-1 rounded text-blue-700 text-xs font-bold">
                          <Star size={12} className="mr-1 fill-blue-700" />
                          {hospital.rating}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 text-slate-500 text-xs mb-3">
                        <MapPin size={14} className="shrink-0 mt-0.5 text-blue-500" />
                        <span>{hospital.address}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
                        {hospital.amenities.slice(0, 3).map((amenity, i) => (
                          <span key={i} className="text-[10px] font-bold uppercase tracking-wide text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                        {hospital.amenities.length > 3 && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            +{hospital.amenities.length - 3} More
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <Link to={`/hospital/${hospital._id}`} className="flex-1">
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors text-sm">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
