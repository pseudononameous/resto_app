/**
 * syncDb.js - Sync Sequelize models to MySQL (creates tables if not exist).
 * Run: node scripts/syncDb.js (from api directory: node scripts/syncDb.js)
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../model');

async function sync() {
  try {
    await db.sequelize.sync({ alter: false });
    console.log('Database sync completed.');
    process.exit(0);
  } catch (err) {
    console.error('Database sync failed:', err.message);
    process.exit(1);
  }
}

sync();
