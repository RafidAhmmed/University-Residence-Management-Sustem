const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  // Profile fields
  dateOfBirth: {
    type: Date,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true,
  },
  homeTown: {
    type: String,
    required: true,
  },
  // Allocation fields (managed by admin)
  allocatedHall: {
    type: String,
    required: true,
  },
  allocatedRoom: {
    type: String,
    
  },
  // Profile picture
  profilePicture: {
    type: String, // URL or base64 string
  },
  tokens: [{
    type: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);