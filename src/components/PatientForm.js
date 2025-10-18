import { useState } from 'react';

const PatientForm = ({ onAddPatient }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '', 
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    address: '',
    emergency_contact: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Required field validation - using backend field names
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    
    // Email format validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (if provided)
    if (formData.phone && !/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Current form data:', formData);
    
    if (!validateForm()) {
      console.log(' FORM VALIDATION FAILED');
      console.log('Errors:', errors);
      return;
    }
    console.log(' FORM VALIDATION PASSED');
    console.log('Sending data to parent component:', formData);

    setLoading(true);
    
    try {
      console.log('Form data being sent:', formData);
      await onAddPatient(formData);
      
      // Reset form after successful submission
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        blood_group: '',
        address: '',
        emergency_contact: ''
      });
      
      setErrors({});

    } catch (error) {
      console.error('Error adding patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>➕ Add New Patient</h2>
        <p>Register a new patient in the system</p>
      </div>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              placeholder="First name"
              className={errors.first_name ? 'error' : ''}
              disabled={loading}
            />
            {errors.first_name && <span className="error-text">{errors.first_name}</span>}
          </div>

          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              placeholder="Last name"
              className={errors.last_name ? 'error' : ''}
              disabled={loading}
            />
            {errors.last_name && <span className="error-text">{errors.last_name}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="patient@email.com"
              className={errors.email ? 'error' : ''}
              disabled={loading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className={errors.phone ? 'error' : ''}
              disabled={loading}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Blood Group</label>
            <select 
              name="blood_group"
              value={formData.blood_group} 
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="form-group">
            <label>Emergency Contact</label>
            <input
              type="tel"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              placeholder="Emergency phone number"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            placeholder="Full address with city and PIN code..."
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
              Adding Patient...
            </>
          ) : (
            <>
              <span>➕</span>
              Add Patient
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PatientForm;