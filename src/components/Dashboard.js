const Dashboard = ({ patients, doctors, appointments }) => {
  const stats = [
    { 
      label: 'Total Patients', 
      value: patients.length, 
      icon: '👥', 
      color: '#3498db'
    },
    { 
      label: 'Available Doctors', 
      value: doctors.filter(d => d.available).length, 
      icon: '🩺', 
      color: '#e74c3c'
    },
    { 
      label: "Today's Appointments", 
      value: appointments.filter(a => a.appointment_date === new Date().toISOString().split('T')[0]).length, 
      icon: '📅', 
      color: '#2ecc71',
    },
    { 
      label: 'Completed Treatments', 
      value: appointments.filter(a => a.status === 'completed').length, 
      icon: '✅', 
      color: '#f39c12',
    }
  ];

  const recentPatients = patients.slice(-3).reverse();
  const upcomingAppointments = appointments
    .filter(a => a.status === 'scheduled')
    .slice(0, 3);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Hospital Dashboard</h2>
        <p>Overview of hospital operations and statistics</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={`stat-${index}`} className="stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
              <span className="stat-change" style={{ color: stat.color }}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>Recent Patients</h3>
          <div className="card-list">
            {recentPatients.map(patient => (
              <div key={`patient-${patient.patient_id || patient.id}`} className="card">
                <div className="card-header">
                  <h4>{patient.first_name} {patient.last_name}</h4>
                  {patient.blood_group && (
                    <span className="badge">{patient.blood_group}</span>
                  )}
                </div>
                <p>📧 {patient.email}</p>
                <p>📞 {patient.phone || 'Not provided'}</p>
                {patient.gender && (
                  <p>👤 {patient.gender}{patient.age && `, ${patient.age} years`}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Upcoming Appointments</h3>
          <div className="card-list">
            {upcomingAppointments.map(appointment => (
              <div key={`appointment-${appointment.appointment_id || appointment.id}`} className="card">
                <div className="card-header">
                  <h4>
                    {appointment.patient_first_name && appointment.patient_last_name 
                      ? `${appointment.patient_first_name} ${appointment.patient_last_name}`
                      : appointment.patientName || 'Unknown Patient'
                    }
                  </h4>
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>
                <p>🩺 Dr. {
                  appointment.doctor_first_name && appointment.doctor_last_name
                    ? `${appointment.doctor_first_name} ${appointment.doctor_last_name}`
                    : appointment.doctorName || 'Unknown Doctor'
                }</p>
                <p>📅 {appointment.appointment_date || appointment.date} at {appointment.appointment_time || appointment.time}</p>
                <p>📋 {appointment.reason || 'No reason provided'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;