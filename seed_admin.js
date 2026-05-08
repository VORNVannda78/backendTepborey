// seed_admin.js — Run ONCE to create admin account
// Usage: node seed_admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const Admin    = require('./models/Admin');

// ══════════════════════════════════════
// 👇 កែ Email + Password + Name នៅទីនេះ
// ══════════════════════════════════════
const ADMINS = [
  {
    name:     'Admin វត្តទេពបុរី',
    email:    'admin@wattepborey.com',   // ← ផ្លាស់ប្ដូរ
    password: 'Tepborey@2026',           // ← ផ្លាស់ប្ដូរ (min 8 chars)
    role:     'super_admin'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const a of ADMINS) {
      const exists = await Admin.findOne({ email: a.email.toLowerCase() });
      if (exists) {
        console.log(`⚠️  ${a.email} already exists — skip`);
        continue;
      }
      const hash = await bcrypt.hash(a.password, 12);
      await Admin.create({
        name:          a.name,
        email:         a.email.toLowerCase(),
        password_hash: hash,
        role:          a.role
      });
      console.log(`✅ Created: ${a.email} (${a.role})`);
    }

    await mongoose.disconnect();
    console.log('🎉 Seed complete!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();
