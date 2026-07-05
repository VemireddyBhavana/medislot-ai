import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeader from '../components/layout/SectionHeader';
import DoctorCard from '../components/display/DoctorCard';
import EmptyState from '../components/layout/EmptyState';
import TextInput from '../components/forms/TextInput';
import SelectInput from '../components/forms/SelectInput';
import LoadingState from '../components/layout/LoadingState';
import { doctorAPI } from '../services/api';

export default function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await doctorAPI.getAll();
        setDoctors(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const specializations = [...new Set(doctors.map(d => d.specialization))].map(spec => ({
    value: spec, label: spec
  }));

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = selectedSpecialization ? doctor.specialization === selectedSpecialization : true;
    return matchesSearch && matchesSpec;
  });

  const handleBook = (doctor) => {
    navigate('/book', { state: { doctorId: doctor._id } });
  };

  return (
    <PageContainer>
      <SectionHeader 
        title="Our Doctors" 
        description="Choose from our experienced and specialist doctors"
      />

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <TextInput 
            id="search"
            placeholder="Search doctors by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <div className="w-full md:w-64">
          <SelectInput 
            id="specialization"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            options={specializations}
            className="w-full"
          />
        </div>
        {selectedSpecialization && (
          <button 
            onClick={() => setSelectedSpecialization('')}
            className="text-sm text-blue-600 font-medium whitespace-nowrap hover:underline px-2"
          >
            Clear Filter
          </button>
        )}
      </div>

      {loading ? (
        <LoadingState text="Loading doctors..." />
      ) : error ? (
        <EmptyState title="Error" description={error} />
      ) : filteredDoctors.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <DoctorCard key={doctor._id} doctor={doctor} onBook={handleBook} />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No doctors found" 
          description="We couldn't find any doctors matching your current search or filters. Try adjusting your criteria."
        />
      )}
    </PageContainer>
  );
}