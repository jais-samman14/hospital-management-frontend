const DoctorList = ({ doctors }) => {
  return (
    <div className="list-container">
      <div className="list-header">
        <h2>🩺 Our Doctors ({doctors.length})</h2>
      </div>

      <div className="card-grid">
        {doctors.map(doctor => (
          <div key={`doctor-${doctor.doctor_id || doctor.id}`} className="doctor-card">
            <div className="card-header">
              <div>
                <h3>
                  {doctor.first_name && doctor.last_name 
                    ? `Dr. ${doctor.first_name} ${doctor.last_name}`
                    : doctor.name || 'Unknown Doctor'
                  }
                </h3>
                <span className="specialization-badge">
                  {doctor.specialization}
                </span>
              </div>
              <span className={`status-badge ${doctor.available ? 'completed' : 'cancelled'}`}>
                <span className={`status-indicator ${doctor.available ? 'available' : 'unavailable'}`}></span>
                {doctor.available ? 'Available' : 'Not Available'}
              </span>
            </div>
            
            <p>⭐ <span className="rating">★★★★☆</span> ({doctor.rating || '4.5'})</p>
            <p>📅 {doctor.experience_years || doctor.experience} years experience</p>
            <p>💰 <span className="fee">₹{doctor.consultation_fee || doctor.consultationFee}</span> consultation fee</p>
            <p>📧 {doctor.email || 'No email provided'}</p>
            <p>📞 {doctor.phone || 'No phone provided'}</p>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;