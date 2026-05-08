const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/auth');
const Leadership = require('../models/Leadership');

// GET /api/leadership — Public
router.get('/', async (req, res) => {
  try {
    const { level } = req.query; // ?level=chief
    const filter = level ? { level } : {};
    const leaders = await Leadership.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(leaders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/leadership/:id — Public
router.get('/:id', async (req, res) => {
  try {
    const leader = await Leadership.findById(req.params.id);
    if (!leader) return res.status(404).json({ error: 'Leader មិនមាន' });
    res.json(leader);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/leadership — Admin only
router.post('/', auth, async (req, res) => {
  try {
    const leader = await Leadership.create(req.body);
    res.status(201).json(leader);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/leadership/:id — Admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const leader = await Leadership.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!leader) return res.status(404).json({ error: 'Leader មិនមាន' });
    res.json(leader);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/leadership/:id — Admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const leader = await Leadership.findByIdAndDelete(req.params.id);
    if (!leader) return res.status(404).json({ error: 'Leader មិនមាន' });
    res.json({ success: true, message: 'Leader ត្រូវបានលុប' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
