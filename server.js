require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // សម្រាប់អានទិន្នន័យជា JSON

// ... កូដដែលមានស្រាប់របស់ព្រះតេជគុណ ...

// ១. Import Routes
const slideRoutes = require('./routes/slideRoutes');

// ២. ប្រើប្រាស់ Routes (ដាក់នៅខាងលើ app.listen)
app.use('/api/slides', slideRoutes);

// ... app.listen(PORT, ...) ...
// ភ្ជាប់ទៅកាន់ MongoDB (ដាក់ក្នុង .env)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("Could not connect to MongoDB", err));

// កំណត់ Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});