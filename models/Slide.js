const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  link: String, // សម្រាប់ចុច Share ទៅ Facebook
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Slide', SlideSchema);