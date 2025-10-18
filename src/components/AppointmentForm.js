import { useState } from 'react';

const AppointmentForm = ({ patients, doctors, onAddAppointment }) => {
  const [formData, setFormData] = useState({
    patient_id: '',       
    doctor_id: '',         
    appointment_date: '', 
    appointment_time: '', 
    reason: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate patient and doctor IDs
    const patient = patients.find(p => p.patient_id == formData.patient_id || p.id == formData.patient_id);
    const doctor = doctors.find(d => d.doctor_id == formData.doctor_id || d.id == formData.doctor_id);
    
    if (patient && doctor && formData.appointment_date && formData.appointment_time) {
      setLoading(true);
      
      try {
        await onAddAppointment(formData);
        setFormData({ 
          patient_id: '', 
          doctor_id: '', 
          appointment_date: '', 
          appointment_time: '', 
          reason: '' 
        });
        
      } catch (error) {
        console.error('Error booking appointment:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getPatientName = (patient) => {
    if (patient.first_name && patient.last_name) {
      return `${patient.first_name} ${patient.last_name}`;
    }
    return patient.name || 'Unknown Patient';
  };

  const getDoctorName = (doctor) => {
    if (doctor.first_name && doctor.last_name) {
      return `Dr. ${doctor.first_name} ${doctor.last_name}`;
    }
    return doctor.name || 'Unknown Doctor';
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>📅 Book New Appointment</h2>
        <p>Schedule a new appointment for a patient</p>
      </div>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Select Patient *</label>
          <select 
            name="patient_id" 
            value={formData.patient_id} 
            onChange={handleChange} 
            required
            disabled={loading}
          >
            <option value="">Choose a patient</option>
            {patients.map(patient => (
              <option 
                key={`patient-${patient.patient_id || patient.id}`} 
                value={patient.patient_id || patient.id}
              >
                {getPatientName(patient)} ({patient.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Doctor *</label>
          <select 
            name="doctor_id" 
            value={formData.doctor_id} 
            onChange={handleChange} 
            required
            disabled={loading}
          >
            <option value="">Choose a doctor</option>
            {doctors.filter(doctor => doctor.available).map(doctor => (
              <option 
                key={`doctor-${doctor.doctor_id || doctor.id}`} 
                value={doctor.doctor_id || doctor.id}
              >
                {getDoctorName(doctor)} ({doctor.specialization}) - ✅ Available
              </option>
            ))}
          </select>
          <div className="form-help">
            Only available doctors are shown
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Appointment Date *</label>
            <input
              type="date"
              name="appointment_date"  
              value={formData.appointment_date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Appointment Time *</label>
            <input
              type="time"
              name="appointment_time" 
              value={formData.appointment_time}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Reason for Appointment *</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            placeholder="Describe the reason for the appointment..."
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className={`btn-primary ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner">⏳</span>
              Booking Appointment...
            </>
          ) : (
            <>
              <span>📅</span>
              Book Appointment
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;