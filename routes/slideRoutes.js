// routes/slideRoutes.js
const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slideController');

// ហៅ GET ទៅកាន់ /api/slides ដើម្បីទាញយកទិន្នន័យ
router.get('/', slideController.getAllSlides);

// ហៅ POST ទៅកាន់ /api/slides ដើម្បីបញ្ចូលទិន្នន័យ
router.post('/', slideController.createSlide);

module.exports = router;