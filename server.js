require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const slideRoutes      = require('./routes/slideRoutes');
const authRoutes       = require('./routes/authRoutes');
const eventRoutes      = require('./routes/eventRoutes');
const galleryRoutes    = require('./routes/galleryRoutes');
const leadershipRoutes = require('./routes/leadershipRoutes');
const settingsRoutes   = require('./routes/settingsRoutes');

// Register Routes
app.use('/api/slides',     slideRoutes);
app.use('/api/auth',       authRoutes);
app.use('/api/events',     eventRoutes);
app.use('/api/gallery',    galleryRoutes);
app.use('/api/leadership', leadershipRoutes);
app.use('/api/settings',   settingsRoutes);

// ភ្ជាប់ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch(err => console.error('❌ Could not connect to MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
