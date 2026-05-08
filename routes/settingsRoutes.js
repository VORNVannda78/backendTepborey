const express  = require('express');
const router   = express.Router();
const auth     = require('../middleware/auth');
const Settings = require('../models/Settings');

// GET /api/settings — Public (Frontend reads contact info, hours etc.)
router.get('/', async (req, res) => {
  try {
    // singleton pattern — always 1 document
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/settings — Admin only
router.put('/', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json(settings);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
