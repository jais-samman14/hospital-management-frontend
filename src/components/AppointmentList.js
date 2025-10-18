import { useState } from 'react';
import { apiService } from '../services/api';

const AppointmentList = ({ appointments, patients, doctors, onAppointmentUpdate }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'scheduled': return 'scheduled';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      case 'no-show': return 'cancelled';
      default: return 'scheduled';
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.patient_id == patientId || p.id == patientId);
    if (patient) {
      return patient.first_name && patient.last_name 
        ? `${patient.first_name} ${patient.last_name}`
        : patient.name || 'Unknown Patient';
    }
    return 'Unknown Patient';
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.doctor_id == doctorId || d.id == doctorId);
    if (doctor) {
      return doctor.first_name && doctor.last_name 
        ? `Dr. ${doctor.first_name} ${doctor.last_name}`
        : doctor.name || 'Unknown Doctor';
    }
    return 'Unknown Doctor';
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = statusFilter ? appointment.status === statusFilter : true;
    const matchesDate = dateFilter ? appointment.appointment_date === dateFilter || appointment.date === dateFilter : true;
    return matchesStatus && matchesDate;
  });

  const handleStatusChange = async (appointmentId, newStatus) => {
    if (!appointmentId) return;
    
    setUpdatingId(appointmentId);
    
    try {
      const result = await apiService.updateAppointment(appointmentId, { 
        status: newStatus 
      });
      
      if (result.success) {
        if (onAppointmentUpdate) {
          onAppointmentUpdate();
        }
      } else {
        alert(result.error || 'Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Error updating appointment status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      handleStatusChange(appointmentId, 'cancelled');
    }
  };

  const handleCompleteAppointment = (appointmentId) => {
    if (window.confirm('Mark this appointment as completed?')) {
      handleStatusChange(appointmentId, 'completed');
    }
  };

  const handleRescheduleAppointment = (appointmentId) => {
    alert('Reschedule functionality would open a form here');
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>📅 Appointments ({filteredAppointments.length})</h2>
        <div className="list-actions">
          <select 
            className="search-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
          <input 
            type="date" 
            className="search-input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <button 
            className="btn-secondary"
            onClick={() => {
              setStatusFilter('');
              setDateFilter('');
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="empty-state">
          <p>No appointments found</p>
          <p>{appointments.length === 0 ? 'Schedule your first appointment to get started!' : 'Try changing your filters'}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(appointment => {
                const appointmentId = appointment.appointment_id || appointment.id;
                const isUpdating = updatingId === appointmentId;
                
                return (
                  <tr key={`appointment-${appointmentId}`}>
                    <td>#{appointmentId}</td>
                    <td>
                      <div className="patient-info">
                        <strong>
                          {appointment.patient_first_name && appointment.patient_last_name 
                            ? `${appointment.patient_first_name} ${appointment.patient_last_name}`
                            : appointment.patientName || getPatientName(appointment.patient_id)
                          }
                        </strong>
                      </div>
                    </td>
                    <td>
                      {appointment.doctor_first_name && appointment.doctor_last_name 
                        ? `Dr. ${appointment.doctor_first_name} ${appointment.doctor_last_name}`
                        : appointment.doctorName || getDoctorName(appointment.doctor_id)
                      }
                    </td>
                    <td>
                      {appointment.appointment_date || appointment.date} at {appointment.appointment_time || appointment.time}
                    </td>
                    <td className="reason-cell">{appointment.reason || 'No reason provided'}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {appointment.status === 'scheduled' && (
                          <>
                            <button 
                              className="btn-sm btn-primary" 
                              title="Complete appointment"
                              onClick={() => handleCompleteAppointment(appointmentId)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? '⏳' : '✅'}
                            </button>
                            <button 
                              className="btn-sm btn-secondary" 
                              title="Reschedule appointment"
                              onClick={() => handleRescheduleAppointment(appointmentId)}
                              disabled={isUpdating}
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn-sm btn-danger" 
                              title="Cancel appointment"
                              onClick={() => handleCancelAppointment(appointmentId)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? '⏳' : '❌'}
                            </button>
                          </>
                        )}
                        {(appointment.status === 'cancelled' || appointment.status === 'no-show') && (
                          <button 
                            className="btn-sm btn-primary" 
                            title="Reopen appointment"
                            onClick={() => handleStatusChange(appointmentId, 'scheduled')}
                            disabled={isUpdating}
                          >
                            {isUpdating ? '⏳' : '↩️'}
                          </button>
                        )}
                        {appointment.status === 'completed' && (
                          <span className="completed-text">Completed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;