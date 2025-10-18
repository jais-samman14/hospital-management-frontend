const API_BASE = process.env.REACT_APP_API_URL || 'https://hospital-management-backend-production-39e6.up.railway.app/api';

// API service functions
export const apiService = {

  getHealth: async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { success: false, error: 'Connection failed' };
    }
  },

  getPatients: async () => {
    try {
      const response = await fetch(`${API_BASE}/patients`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      return { success: false, error: 'Failed to fetch patients' };
    }
  },

  createPatient: async (patientData) => {
    try {
      const response = await fetch(`${API_BASE}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to create patient:', error);
      return { success: false, error: 'Failed to create patient' };
    }
  },

  getDoctors: async () => {
    try {
      const response = await fetch(`${API_BASE}/doctors`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      return { success: false, error: 'Failed to fetch doctors' };
    }
  },

  getAppointments: async () => {
    try {
      const response = await fetch(`${API_BASE}/appointments`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      return { success: false, error: 'Failed to fetch appointments' };
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      const response = await fetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to create appointment:', error);
      return { success: false, error: 'Failed to create appointment' };
    }
  },

  updateAppointment: async (appointmentId, updateData) => {
    try {
      const response = await fetch(`${API_BASE}/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      return await response.json();
    } 
    catch (error) {
    console.error('Failed to update appointment:', error);
    return { success: false, error: 'Failed to update appointment' };
  }
  }
};

export default apiService;