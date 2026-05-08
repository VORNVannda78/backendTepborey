const mongoose = require('mongoose');
const LeadershipSchema = new mongoose.Schema({
  name_km: { type: String, required: true },
  name_en: { type: String, required: true },
  role_km: { type: String, required: true },
  role_en: { type: String, required: true },
  level:   { type: String, enum: ['chief','deputy','achar','committee'], default: 'achar' },
  image:   { type: String, default: '' },
  bio_km:  { type: String, default: '' },
  bio_en:  { type: String, default: '' },
  order:   { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('Leadership', LeadershipSchema);
