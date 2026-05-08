const mongoose = require('mongoose');
const SettingsSchema = new mongoose.Schema({
  address_km:   { type: String, default: '' },
  address_en:   { type: String, default: '' },
  phone1:       { type: String, default: '' },
  phone2:       { type: String, default: '' },
  hours_km:     { type: String, default: 'រៀងរាល់ថ្ងៃ: ម៉ោង ៦ ព្រឹក - ៦ ល្ងាច' },
  hours_en:     { type: String, default: 'Everyday: 6:00 AM - 6:00 PM' },
  facebook:     { type: String, default: '' },
  maps_url:     { type: String, default: '' },
  qr_aba:       { type: String, default: '' },
  qr_wing:      { type: String, default: '' },
  aba_account:  { type: String, default: '' },
  wing_account: { type: String, default: '' },
  history_km:   { type: String, default: '' },
  history_en:   { type: String, default: '' },
  vision_km:    { type: String, default: '' },
  vision_en:    { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('Settings', SettingsSchema);
