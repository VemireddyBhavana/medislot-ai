import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Filter, AlertTriangle } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeader from '../components/layout/SectionHeader';
import CardWrapper from '../components/layout/CardWrapper';
import TextInput from '../components/forms/TextInput';
import SelectInput from '../components/forms/SelectInput';
import AppointmentStatusBadge from '../components/ui/AppointmentStatusBadge';
import NoShowRiskBadge from '../components/ui/NoShowRiskBadge';
import PriorityBadge from '../components/ui/PriorityBadge';
import LoadingState from '../components/layout/LoadingState';
import EmptyState from '../components/layout/EmptyState';
import clsx from 'clsx';
import { appointmentAPI } from '../services/api';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { globalSearch: searchTerm, setGlobalSearch: setSearchTerm } = useOutletContext();
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentAPI.getAll();
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentAPI.updateStatus(id, { status: newStatus });
      // Update local state to reflect change without refetching immediately
      setAppointments(prev => prev.map(apt => apt._id === id ? { ...apt, status: newStatus } : apt));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader 
        title="Manage Appointments" 
        description="Oversee clinic schedule, flag high-risk no-shows, and manage urgent care routing."
      />

      {/* Filter & Search Bar */}
      <CardWrapper className="bg-white p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <TextInput 
              id="search"
              placeholder="Search by Patient ID, Name, or Doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          
          <div className="w-full lg:w-48 flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <SelectInput 
              id="statusFilter"
              className="flex-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'booked', label: 'Booked' },
                { value: 'completed', label: 'Completed' },
                { value: 'no-show', label: 'No-Show' },
                { value: 'cancelled', label: 'Cancelled' }
              ]}
            />
          </div>
        </div>
      </CardWrapper>

      {/* Appointments Table */}
      {loading ? (
        <LoadingState text="Loading appointments..." />
      ) : error ? (
        <EmptyState title="Error" description={error} />
      ) : (
        <CardWrapper className="overflow-hidden" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Appointment ID</th>
                  <th className="px-6 py-4 font-semibold">Patient & Doctor</th>
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold text-center">Smart Attributes</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.length > 0 ? filteredAppointments.map((apt) => (
                  <tr 
                    key={apt._id} 
                    className={clsx(
                      'hover:bg-slate-50 transition-colors group',
                      apt.priority === 'urgent' && apt.status === 'booked' ? 'bg-red-50/50 hover:bg-red-50' : '',
                      apt.noShowRisk === 'high' && apt.status === 'booked' ? 'bg-orange-50/50 hover:bg-orange-50' : ''
                    )}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium text-slate-900">{apt._id.substring(0, 8).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{apt.patientName}</p>
                      <p className="text-xs text-blue-600 font-medium">{apt.doctorName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{apt.appointmentDate}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        {apt.appointmentTime}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        <PriorityBadge priority={apt.priority} />
                        <NoShowRiskBadge risk={apt.noShowRisk} />
                        {apt.noShowReason && (
                          <span 
                            className="text-[10px] text-slate-500 italic max-w-[120px] truncate block cursor-help" 
                            title={apt.noShowReason}
                          >
                            {apt.noShowReason}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                         {apt.noShowRisk === 'high' && apt.status === 'no-show' && <AlertTriangle size={14} className="text-red-500" />}
                         <AppointmentStatusBadge status={apt.status} />
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <select 
                          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-600 focus:outline-none focus:border-blue-500"
                          value={apt.status}
                          onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                        >
                          <option value="booked">Booked</option>
                          <option value="completed">Complete</option>
                          <option value="no-show">No-Show</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No appointments found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardWrapper>
      )}
    </div>
  );
}