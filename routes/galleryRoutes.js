const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const Gallery = require('../models/Gallery');

// GET /api/gallery — Public
router.get('/', async (req, res) => {
  try {
    const { category, year } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (year)     filter.year     = year;
    const photos = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/gallery — Admin only
router.post('/', auth, async (req, res) => {
  try {
    const photo = await Gallery.create(req.body);
    res.status(201).json(photo);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/gallery/:id — Admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const photo = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!photo) return res.status(404).json({ error: 'Photo មិនមាន' });
    res.json(photo);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/gallery/:id — Admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const photo = await Gallery.findByIdAndDelete(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo មិនមាន' });
    res.json({ success: true, message: 'Photo ត្រូវបានលុប' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
