const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },
  role:          { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  is_active:     { type: Boolean, default: true },
  otp_code:      { type: String, default: null },
  otp_expires:   { type: Date,   default: null },
}, { timestamps: true });
module.exports = mongoose.model('Admin', AdminSchema);
