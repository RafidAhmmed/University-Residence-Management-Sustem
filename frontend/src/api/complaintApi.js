import api from './api';

export const complaintAPI = {
  // User APIs
  getUserComplaints: () => api.get('/complaints/my'),
  createComplaint: (complaintData) => api.post('/complaints', complaintData),

  // Admin APIs
  getAllComplaints: () => api.get('/complaints'),
  updateComplaintStatus: (complaintId, statusData) => api.put(`/complaints/${complaintId}/status`, statusData),
};