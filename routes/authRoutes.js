const express    = require('express');
const router     = express.Router();
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Admin      = require('../models/Admin');

const OTP_EXPIRES = 10 * 60 * 1000; // 10 minutes

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

async function sendOTPEmail(toEmail, otp, name) {
  await transporter.sendMail({
    from: `"វត្តទេពបុរី Admin" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🔑 OTP: ${otp} — Admin Dashboard`,
    html: `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
      <h2 style="color:#1E3D2F;text-align:center">🪷 វត្តទេពបុរី</h2>
      <p>សួស្ដី <strong>${name || 'Admin'}</strong>,</p>
      <p>OTP Code សម្រាប់កំណត់ Password ថ្មី:</p>
      <div style="background:#1E3D2F;border-radius:12px;padding:24px;text-align:center;margin:20px 0">
        <span style="color:#C9A646;font-size:40px;font-weight:700;letter-spacing:14px">${otp}</span>
      </div>
      <p style="color:#ef4444">⚠️ Valid ត្រឹម <strong>10 នាទី</strong> ប៉ុណ្ណោះ</p>
      <p style="color:#9ca3af;font-size:12px">ប្រសិនបើអ្នកមិនបានស្នើ — សូមព្រងើយកន្ដើយ Email នេះ</p>
    </div>`
  });
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email និង Password ត្រូវការ' });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) return res.status(401).json({ error: 'Email ឬ Password មិនត្រឹមត្រូវ' });
    if (!admin.is_active) return res.status(403).json({ error: 'Account ត្រូវបានបិទ' });

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) return res.status(401).json({ error: 'Email ឬ Password មិនត្រឹមត្រូវ' });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, admin: { name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server Error: ' + err.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email ត្រូវការ' });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) return res.json({ success: true, message: 'ប្រសិនបើ Email ត្រឹមត្រូវ OTP នឹងត្រូវផ្ញើ' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp_code    = otp;
    admin.otp_expires = new Date(Date.now() + OTP_EXPIRES);
    await admin.save();

    await sendOTPEmail(admin.email, otp, admin.name);
    res.json({ success: true, message: 'OTP ត្រូវបានផ្ញើទៅ Email' });
  } catch (err) {
    res.status(500).json({ error: 'មិនអាចផ្ញើ Email: ' + err.message });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email និង OTP ត្រូវការ' });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin || !admin.otp_code) return res.status(400).json({ error: 'OTP មិនត្រឹមត្រូវ' });
    if (admin.otp_code !== otp.trim()) return res.status(400).json({ error: 'OTP Code មិនត្រឹមត្រូវ' });
    if (new Date() > admin.otp_expires) return res.status(400).json({ error: 'OTP ផុតកំណត់ — ផ្ញើម្ដងទៀត' });

    const reset_token = jwt.sign(
      { email: admin.email, purpose: 'reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ success: true, reset_token });
  } catch (err) {
    res.status(500).json({ error: 'Server Error: ' + err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp_token, new_password } = req.body;
    if (!email || !otp_token || !new_password) return res.status(400).json({ error: 'ព័ត៌មានមិនគ្រប់គ្រាន់' });
    if (new_password.length < 8) return res.status(400).json({ error: 'Password ត្រូវ ៨ ខ្ទង់ឡើងទៅ' });

    let decoded;
    try { decoded = jwt.verify(otp_token, process.env.JWT_SECRET); }
    catch { return res.status(400).json({ error: 'Token ផុតកំណត់ — ស្នើ OTP ម្ដងទៀត' }); }

    if (decoded.purpose !== 'reset' || decoded.email !== email.toLowerCase()) {
      return res.status(400).json({ error: 'Token មិនត្រឹមត្រូវ' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(404).json({ error: 'Admin មិនមាន' });

    admin.password_hash = await bcrypt.hash(new_password, 12);
    admin.otp_code      = null;
    admin.otp_expires   = null;
    await admin.save();

    res.json({ success: true, message: 'Password ត្រូវបានផ្លាស់ប្ដូរ' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error: ' + err.message });
  }
});

// GET /api/auth/me (protected)
router.get('/me', require('../middleware/auth'), async (req, res) => {
  const admin = await Admin.findOne({ email: req.user.email }).select('-password_hash -otp_code');
  if (!admin) return res.status(404).json({ error: 'Not found' });
  res.json(admin);
});

module.exports = router;
