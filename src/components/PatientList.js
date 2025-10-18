const PatientList = ({ patients }) => {
  return (
    <div className="patient-list-container">
      <div className="list-header">
        <h2>👥 Patients List ({patients.length})</h2>
      </div>

      {patients.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👨‍⚕️</div>
          <h3>No patients found</h3>
          <p>Add your first patient to get started!</p>
          <button className="btn-primary">Add Patient</button>
        </div>
      ) : (
        <div className="card-grid">
          {patients.map(patient => (
            <div key={patient.patient_id} className="patient-card">
              <div className="card-header">
                <h3>{patient.first_name} {patient.last_name}</h3>
                <span className="patient-id">ID: {patient.patient_id}</span>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <span className="icon">📧</span>
                  <span className="text">{patient.email}</span>
                </div>
                <div className="info-row">
                  <span className="icon">📞</span>
                  <span className="text">{patient.phone || 'Not provided'}</span>
                </div>
                {patient.blood_group && (
                  <div className="info-row">
                    <span className="icon">🩸</span>
                    <span className="text">{patient.blood_group}</span>
                  </div>
                )}
                {patient.gender && (
                  <div className="info-row">
                    <span className="icon">👤</span>
                    <span className="text">{patient.gender}</span>
                  </div>
                )}
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientList;