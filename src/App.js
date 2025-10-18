import { useState, useEffect } from 'react';
import './styles.css';
import Dashboard from './components/Dashboard';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import DoctorList from './components/DoctorList';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import { apiService } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Checking...');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'patients', label: 'Patients', icon: '👥' },
    { id: 'doctors', label: 'Doctors', icon: '🩺' },
    { id: 'appointments', label: 'Appointments', icon: '📅' }
  ];

  // Fetch all data on component mount
  useEffect(() => {
    checkConnection();
    fetchAllData();
  }, []);

  const checkConnection = async () => {
    try {
      const health = await apiService.getHealth();
      setConnectionStatus(health.success ? 'Online' : 'Offline');
    } catch (error) {
      setConnectionStatus('Offline');
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parallel API calls
      const [patientsData, doctorsData, appointmentsData] = await Promise.all([
        apiService.getPatients(),
        apiService.getDoctors(),
        apiService.getAppointments()
      ]);

      if (patientsData.success) setPatients(patientsData.data || []);
      if (doctorsData.success) setDoctors(doctorsData.data || []);
      if (appointmentsData.success) setAppointments(appointmentsData.data || []);

      if (!patientsData.success || !doctorsData.success || !appointmentsData.success) {
        setError('Failed to fetch some data from server');
      }

    } 
    catch(err) {
      setError('Unable to connect to server. Please ensure the backend service is running.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async(newPatient) => {
    try {
      console.log('frontend sending data:', newPatient);

      // Map frontend field names to backend field names
      const result = await apiService.createPatient({
        first_name: newPatient.firstName || newPatient.first_name,      
        last_name: newPatient.lastName || newPatient.last_name,         
        email: newPatient.email,
        phone: newPatient.phone,
        date_of_birth: newPatient.dateOfBirth || newPatient.date_of_birth,  
        gender: newPatient.gender,
        blood_group: newPatient.bloodGroup || newPatient.blood_group,    
        address: newPatient.address,
        emergency_contact: newPatient.emergencyContact || newPatient.emergency_contact 
      });

      if(result.success){
        alert('Patient successfully added!');
        fetchAllData(); // Refresh data
      } 
      else {
        alert(result.error || 'Failed to add patient');
      }
    } 
    catch (err) {
      alert('Failed to add patient.Try again');
      console.error('Error adding patient:', err);
    }
  };

  const addAppointment = async (newAppointment) => {
    try {
      
      const result = await apiService.createAppointment({
        patient_id: newAppointment.patientId || newAppointment.patient_id,          
        doctor_id: newAppointment.doctorId || newAppointment.doctor_id,             
        appointment_date: newAppointment.date || newAppointment.appointment_date,         
        appointment_time: newAppointment.time || newAppointment.appointment_time, 
        reason: newAppointment.reason
      });

      if (result.success) {
        alert('Appointment successfully booked! ✅');
        fetchAllData(); // Refresh data
      } else {
        alert(result.error || 'Failed to book appointment');
      }
    } catch (err) {
      alert('Failed to book appointment. Please try again');
      console.error('Error booking appointment:', err);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <div className="header-content">
            <h1>🏥 Hospital Management System</h1>
          </div>
        </header>
        <div className="loading">
          <p>📡 Loading data from server...</p>
          <p>Please make sure backend is running</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="header">
          <div className="header-content">
            <h1>🏥 Hospital Management System</h1>
            <p className="error-status">Disconnected from backend </p>
          </div>
        </header>
        <div className="error">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={fetchAllData} className="retry-btn">Retry Connection</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🏥 Hospital Management System</h1>
          <p className="connection-status">{connectionStatus}</p>
        </div>
        <nav className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            patients={patients}
            doctors={doctors}
            appointments={appointments}
          />
        )}
        
        {activeTab === 'patients' && (
          <div className="tab-content">
            <PatientForm onAddPatient={addPatient} />
            <PatientList patients={patients} />
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="tab-content">
            <DoctorList doctors={doctors} />
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="tab-content">
            <AppointmentForm 
              patients={patients}
              doctors={doctors.filter(d => d.available)}
              onAddAppointment={addAppointment}
            />
            <AppointmentList 
              appointments={appointments}
              patients={patients}
              doctors={doctors}
              onAppointmentUpdate={fetchAllData}
            />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2024 Hospital Management System. Connected to real backend API 🚀</p>
      </footer>
    </div>
  );
}

export default App;