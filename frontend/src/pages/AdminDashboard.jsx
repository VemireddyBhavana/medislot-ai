import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, Calendar, CalendarCheck, CheckCircle2, 
  XCircle, AlertTriangle, Clock, TrendingUp, Activity, Bell
} from 'lucide-react';
import DashboardStatCard from '../components/display/DashboardStatCard';
import CardWrapper from '../components/layout/CardWrapper';
import NoShowRiskBadge from '../components/ui/NoShowRiskBadge';
import PriorityBadge from '../components/ui/PriorityBadge';
import LoadingState from '../components/layout/LoadingState';
import { doctorAPI, appointmentAPI } from '../services/api';

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { globalSearch } = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [docs, apts] = await Promise.all([
          doctorAPI.getAll(),
          appointmentAPI.getAll()
        ]);
        setDoctors(docs);
        setAppointments(apts);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="py-12"><LoadingState text="Loading dashboard data..." /></div>;
  }

  // Calculate dynamic stats
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  const booked = appointments.filter(a => a.status === 'booked').length;
  const completed = appointments.filter(a => a.status === 'completed').length;
  const cancelled = appointments.filter(a => a.status === 'cancelled').length;
  const noShows = appointments.filter(a => a.status === 'no-show').length;
  const highRisk = appointments.filter(a => a.noShowRisk === 'high' && a.status === 'booked').length;
  
  // Calculate today's appointments (simplified date matching for demo)
  const today = new Date().toISOString().split('T')[0];
  const todaysApts = appointments.filter(a => a.appointmentDate === today).length;

  // Derive status percentages for donut chart
  const bookedPct = totalAppointments ? Math.round((booked / totalAppointments) * 100) : 0;
  const completedPct = totalAppointments ? Math.round((completed / totalAppointments) * 100) : 0;
  const noShowCancelPct = totalAppointments ? Math.round(((noShows + cancelled) / totalAppointments) * 100) : 0;

  // Get actionable alerts (Urgent and High Risk)
  const urgentApts = appointments.filter(a => 
    a.priority === 'urgent' && 
    a.status === 'booked' &&
    (!globalSearch || 
      a.patientName?.toLowerCase().includes(globalSearch.toLowerCase()) || 
      a.doctorName?.toLowerCase().includes(globalSearch.toLowerCase())
    )
  ).slice(0, 2);

  const highRiskApts = appointments.filter(a => 
    a.noShowRisk === 'high' && 
    a.status === 'booked' &&
    (!globalSearch || 
      a.patientName?.toLowerCase().includes(globalSearch.toLowerCase()) || 
      a.doctorName?.toLowerCase().includes(globalSearch.toLowerCase())
    )
  ).slice(0, 2);

  // Compute Workload Distribution
  const todaysAptsList = appointments.filter(a => a.appointmentDate === today && (a.status === 'booked' || a.status === 'completed'));
  let workloads = doctors.map(doc => {
    return {
      name: doc.name,
      count: todaysAptsList.filter(a => a.doctorId === doc._id).length
    };
  });
  workloads.sort((a, b) => a.count - b.count);
  const leastLoaded = workloads.length > 0 ? workloads[0] : null;
  const mostLoaded = workloads.length > 0 ? workloads[workloads.length - 1] : null;

  const formatDoctorName = (name) => {
    if (!name) return '';
    return name.startsWith('Dr. ') ? name : `Dr. ${name}`;
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Summary Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard title="Total Doctors" value={totalDoctors} icon={Users} />
        <DashboardStatCard title="Today's Appointments" value={todaysApts} icon={Calendar} trend={12} trendLabel="vs yesterday" />
        <DashboardStatCard title="Total Appointments" value={totalAppointments} icon={Clock} />
        <DashboardStatCard title="High No-Show Risk" value={highRisk} icon={AlertTriangle} trend={-2} trendLabel="vs last week" />
        
        <DashboardStatCard title="Total Booked" value={booked} icon={CalendarCheck} />
        <DashboardStatCard title="Completed" value={completed} icon={CheckCircle2} />
        <DashboardStatCard title="Cancelled" value={cancelled} icon={XCircle} />
        <DashboardStatCard title="No-Shows" value={noShows} icon={AlertTriangle} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content Area (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 2. Appointment Overview (Chart Placeholder) */}
          <CardWrapper className="h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Appointments Overview</h3>
              <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="flex-1 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden">
              <TrendingUp size={48} className="mb-4 text-blue-200" />
              <p className="font-medium text-slate-500">Area Chart Placeholder</p>
              <p className="text-xs text-slate-400 mt-1">Booking volume over time</p>
              {/* Fake chart bars/grid */}
              <div className="absolute bottom-0 w-full flex items-end justify-between px-8 opacity-20">
                 {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                   <div key={i} className="w-8 bg-blue-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                 ))}
              </div>
            </div>
          </CardWrapper>

          {/* 4. Smart Insights & Alerts Section */}
          <h3 className="text-lg font-bold text-gray-900 pt-2 border-b border-gray-200 pb-2">MediSlot AI Insights</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            
            <CardWrapper className="bg-gradient-to-br from-orange-50 to-white border-orange-100 p-5">
              <div className="flex items-center gap-2 mb-3 text-orange-600">
                <Activity size={20} />
                <h4 className="font-bold">Overloaded Doctor Alert</h4>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-semibold text-gray-900">{doctors.length > 0 ? doctors[0].name : 'System'}</span> is currently operating at 115% capacity.
              </p>
              <p className="text-xs text-orange-600 font-medium">Recommendation: Route routine visits elsewhere.</p>
            </CardWrapper>

            <CardWrapper className="bg-gradient-to-br from-green-50 to-white border-green-100 p-5">
              <div className="flex items-center gap-2 mb-3 text-green-600">
                <Clock size={20} />
                <h4 className="font-bold">Capacity Optimization</h4>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Optimal booking window detected between <span className="font-semibold text-gray-900">2:00 PM and 4:00 PM</span>.
              </p>
              <p className="text-xs text-green-600 font-medium">System is currently prioritizing these slots.</p>
            </CardWrapper>
            
          </div>

        </div>

        {/* Sidebar Area (1/3 width) */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* 3. Appointment Status Breakdown (Donut Chart Placeholder) */}
          <CardWrapper className="flex flex-col h-[400px]">
             <h3 className="text-lg font-bold text-gray-900 mb-6">Status Breakdown</h3>
             <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-100 flex items-center justify-center mb-6">
                  <div className="absolute inset-0 rounded-full border-[16px] border-blue-500 border-r-transparent border-b-transparent transform -rotate-45"></div>
                  <div className="absolute inset-0 rounded-full border-[16px] border-green-400 border-t-transparent border-l-transparent transform rotate-45"></div>
                  <div className="absolute inset-0 rounded-full border-[16px] border-orange-400 border-b-transparent border-l-transparent transform -rotate-[135deg]"></div>
                  
                  <div className="text-center">
                    <span className="text-2xl font-bold text-gray-900">{totalAppointments}</span>
                    <span className="block text-xs text-gray-500 uppercase tracking-wide">Total</span>
                  </div>
                </div>
                
                <div className="w-full space-y-2 text-sm">
                  <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span>Booked</span><span className="font-medium">{bookedPct}%</span></div>
                  <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400"></span>Completed</span><span className="font-medium">{completedPct}%</span></div>
                  <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-400"></span>No-Show/Cancel</span><span className="font-medium">{noShowCancelPct}%</span></div>
                </div>
             </div>
          </CardWrapper>

          {/* Doctor Workload Distribution */}
          <CardWrapper>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity size={18} className="text-blue-500" /> Workload Balancing
              </h3>
            </div>
            
            <div className="space-y-4">
              {mostLoaded && (
                <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">Overloaded</span>
                    <span className="text-xs font-bold text-orange-600 bg-white px-2 rounded-full">{mostLoaded.count} appts</span>
                  </div>
                  <p className="text-sm font-medium text-orange-900">{formatDoctorName(mostLoaded.name)}</p>
                </div>
              )}
              {leastLoaded && (
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Recommended</span>
                    <span className="text-xs font-bold text-emerald-600 bg-white px-2 rounded-full">{leastLoaded.count} appts</span>
                  </div>
                  <p className="text-sm font-medium text-emerald-900">{formatDoctorName(leastLoaded.name)}</p>
                  <p className="text-[10px] text-emerald-700 mt-1">Route patients here for faster care</p>
                </div>
              )}
            </div>
          </CardWrapper>

          {/* Actionable Alerts List */}
          <CardWrapper>
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                 <Bell size={18} className="text-red-500" /> Action Required
               </h3>
               <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{urgentApts.length + highRiskApts.length}</span>
             </div>
             
             <div className="space-y-4 divide-y divide-gray-100">
               
               {urgentApts.map((apt, idx) => (
                 <div key={`urgent-${idx}`} className="pt-2">
                   <div className="flex justify-between items-start mb-1">
                     <p className="text-sm font-semibold text-gray-900">Urgent Appointment</p>
                     <PriorityBadge priority="urgent" />
                   </div>
                   <p className="text-xs text-gray-500">Patient: {apt.patientName} • {apt.doctorName}</p>
                 </div>
               ))}

                {highRiskApts.map((apt, idx) => (
                  <div key={`risk-${idx}`} className="pt-4">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-semibold text-gray-900">High Risk of No-Show</p>
                      <NoShowRiskBadge risk="high" />
                    </div>
                    <p className="text-xs text-gray-500">Patient: {apt.patientName} • {apt.appointmentTime} Slot</p>
                    {apt.noShowReason && (
                      <p className="text-[11px] text-orange-700 bg-orange-50/50 border border-orange-100/50 rounded-lg p-2 mt-1.5 font-medium italic">
                        {apt.noShowReason}
                      </p>
                    )}
                    <button className="mt-2 text-xs font-medium text-blue-600 hover:underline">Send Manual SMS</button>
                  </div>
                ))}
               
               {urgentApts.length === 0 && highRiskApts.length === 0 && (
                 <div className="pt-2 text-sm text-gray-500 text-center">No immediate actions required.</div>
               )}

             </div>
          </CardWrapper>

        </div>
      </div>
    </div>
  );
}
