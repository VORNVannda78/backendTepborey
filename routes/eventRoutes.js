const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const Event   = require('../models/Event');

// GET /api/events — Public
router.get('/', async (req, res) => {
  try {
    const { status } = req.query; // ?status=upcoming or ?status=past
    const filter = status ? { status } : {};
    const events = await Event.find(filter).sort({ date: -1 });
    res.json(events);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/events/:id — Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event មិនមាន' });
    res.json(event);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/events — Admin only
router.post('/', auth, async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/events/:id — Admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ error: 'Event មិនមាន' });
    res.json(event);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/events/:id — Admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event មិនមាន' });
    res.json({ success: true, message: 'Event ត្រូវបានលុប' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
