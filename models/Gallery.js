const mongoose = require('mongoose');
const GallerySchema = new mongoose.Schema({
  src:      { type: String, required: true },
  category: { type: String, required: true,
    enum: ['kathina','pchum_ben','khmer_new_year','visak_bochea','phka','meak_bochea','temple','social'] },
  year:     { type: String, default: '2025' },
  title_km: { type: String, default: '' },
  title_en: { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('Gallery', GallerySchema);
