const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
  title_km:     { type: String, required: true },
  title_en:     { type: String, required: true },
  date:         { type: String, required: true },
  time:         { type: String, default: '' },
  lunarDate_km: { type: String, default: '' },
  lunarDate_en: { type: String, default: '' },
  location_km:  { type: String, default: 'វត្តទេពបុរី' },
  location_en:  { type: String, default: 'Wat Tepborey' },
  desc_km:      { type: String, default: '' },
  desc_en:      { type: String, default: '' },
  purpose_km:   { type: String, default: '' },
  purpose_en:   { type: String, default: '' },
  image:        { type: String, default: '' },
  gallery:      [{ type: String }],
  schedule:     [{ time: String, activity_km: String, activity_en: String }],
  link:         { type: String, default: '' },
  status:       { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
}, { timestamps: true });
module.exports = mongoose.model('Event', EventSchema);
