import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Info, CheckCircle2, AlertTriangle, TrendingDown } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeader from '../components/layout/SectionHeader';
import CardWrapper from '../components/layout/CardWrapper';
import TextInput from '../components/forms/TextInput';
import SelectInput from '../components/forms/SelectInput';
import DateInput from '../components/forms/DateInput';
import TimeInput from '../components/forms/TimeInput';
import TextareaInput from '../components/forms/TextareaInput';
import PrimaryButton from '../components/ui/PrimaryButton';
import RecommendationBadge from '../components/ui/RecommendationBadge';
import NoShowRiskBadge from '../components/ui/NoShowRiskBadge';
import { doctorAPI, appointmentAPI } from '../services/api';

export default function BookAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialDoctorId = location.state?.doctorId || '';

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    doctorId: initialDoctorId,
    appointmentDate: '',
    appointmentTime: '',
    priority: 'routine',
    noShowRisk: 'low', // default for form
    notes: ''
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorAPI.getAll();
        setDoctors(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  const doctorsList = doctors.map(doc => ({
    value: doc._id,
    label: `${doc.name} (${doc.specialization})`
  }));

  const priorityOptions = [
    { value: 'routine', label: 'Routine Checkup' },
    { value: 'follow-up', label: 'Follow-up Visit' },
    { value: 'urgent', label: 'Urgent Care' }
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSmartSlotSelect = (date, time, doctorId) => {
    setFormData(prev => ({
      ...prev,
      appointmentDate: date,
      appointmentTime: time,
      doctorId: doctorId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await appointmentAPI.book(formData);
      navigate('/confirmation', { state: { appointment: res.appointment } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error booking appointment');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate dynamic smart slots based on fetched doctors (fallback if none)
  const smartSlots = doctors.length > 0 ? [
    { date: '2026-07-10', time: '10:00', doc: doctors[0]._id, docName: doctors[0].name, reason: 'Lower Doctor Load' },
    { date: '2026-07-10', time: '14:30', doc: doctors[1]?._id || doctors[0]._id, docName: doctors[1]?.name || doctors[0].name, reason: 'Shorter Waiting Time' },
  ] : [];

  return (
    <PageContainer>
      <SectionHeader 
        title="Book an Appointment" 
        description="Please fill out the details below. Our intelligent system will guide you to the best available slots."
      />

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN - Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          <CardWrapper className="border-t-4 border-t-blue-600">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Patient Information</h3>
            
            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid sm:grid-cols-2 gap-6">
                <TextInput 
                  id="patientName"
                  label="Full Name"
                  placeholder="John Doe"
                  required
                  value={formData.patientName}
                  onChange={handleChange}
                />
                <TextInput 
                  id="patientPhone"
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                  required
                  value={formData.patientPhone}
                  onChange={handleChange}
                />
              </div>
              
              <TextInput 
                id="patientEmail"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.patientEmail}
                onChange={handleChange}
              />

              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4 mt-8 pt-4">Appointment Details</h3>
              
              <SelectInput
                id="doctorId"
                label="Select Doctor"
                options={doctorsList}
                required
                value={formData.doctorId}
                onChange={handleChange}
              />

              <div className="grid sm:grid-cols-2 gap-6">
                <DateInput 
                  id="appointmentDate"
                  label="Preferred Date"
                  required
                  value={formData.appointmentDate}
                  onChange={handleChange}
                />
                <TimeInput 
                  id="appointmentTime"
                  label="Preferred Time"
                  required
                  value={formData.appointmentTime}
                  onChange={handleChange}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <SelectInput
                  id="priority"
                  label="Urgency Level"
                  options={priorityOptions}
                  value={formData.priority}
                  onChange={handleChange}
                />
                <SelectInput
                  id="noShowRisk"
                  label="Calculated Risk (Simulation)"
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' }
                  ]}
                  value={formData.noShowRisk}
                  onChange={handleChange}
                />
              </div>

              <TextareaInput 
                id="notes"
                label="Symptoms or Purpose of Visit"
                placeholder="Please describe your symptoms briefly..."
                rows={3}
                value={formData.notes}
                onChange={handleChange}
              />

              <div className="pt-4">
                <PrimaryButton type="submit" disabled={submitting} className="w-full sm:w-auto text-lg px-8 py-3">
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </PrimaryButton>
              </div>
            </form>
          </CardWrapper>
        </div>

        {/* RIGHT COLUMN - Smart Recommendation Panel */}
        <div className="lg:col-span-1 space-y-6 sticky top-24">
          
          <CardWrapper className="bg-gradient-to-b from-blue-50 to-white border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-blue-600" size={20} />
              <h3 className="text-lg font-bold text-gray-900">Smart Slots</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Select a recommended slot for a better clinic experience.</p>
            
            <div className="space-y-3">
              {smartSlots.map((slot, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSmartSlotSelect(slot.date, slot.time, slot.doc)}
                  className="w-full text-left p-3 rounded-lg border border-blue-200 bg-white hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {slot.date} at {slot.time}
                    </span>
                    <RecommendationBadge text="Optimal" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium mb-1">{slot.docName}</p>
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    {slot.reason}
                  </p>
                </button>
              ))}
            </div>
          </CardWrapper>

          <CardWrapper className="bg-slate-50 border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="text-slate-500" size={18} />
              <h4 className="font-semibold text-slate-700">Why these slots?</h4>
            </div>
            <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside ml-1">
              <li>Balancing patient load across the day.</li>
              <li>Ensuring sufficient consultation time.</li>
              <li>Avoiding historic high-traffic hours.</li>
            </ul>
          </CardWrapper>

          <CardWrapper className="flex items-center justify-between p-4 bg-white border border-gray-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-500" size={20} />
              <div>
                <p className="text-sm font-semibold text-gray-900">No-Show Risk Prediction</p>
                <p className="text-xs text-gray-500">Based on historic patterns</p>
              </div>
            </div>
            <NoShowRiskBadge risk={formData.noShowRisk} />
          </CardWrapper>
          
        </div>
      </div>
    </PageContainer>
  );
}