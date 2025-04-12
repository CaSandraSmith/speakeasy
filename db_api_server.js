const express = require('express');
const { exec } = require('child_process');
const { Pool } = require('pg');
const { faker } = require('@faker-js/faker');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'speakeasy',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'speakeasy_dev',
  password: process.env.DB_PASSWORD || 'secretpassword',
  port: 5432,
});

// Add JSON body parser
app.use(express.json());

// Status endpoint
app.get('/api/status', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      const results = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM users) as user_count,
          (SELECT COUNT(*) FROM bundles) as bundle_count,
          (SELECT COUNT(*) FROM experiences) as experience_count,
          (SELECT COUNT(*) FROM bookings) as booking_count,
          (SELECT COUNT(*) FROM reviews) as review_count
      `);
      res.json({
        status: 'connected',
        counts: results.rows[0]
      });
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: err.message
    });
  }
});

// Reset database with basic data
app.post('/api/reset', (req, res) => {
  exec('docker exec speakeasy_db psql -U speakeasy -d speakeasy_dev -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" && docker exec speakeasy_db psql -U speakeasy -d speakeasy_dev -f /docker-entrypoint-initdb.d/init.sql', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
    res.json({ status: 'success', message: 'Database reset with basic data' });
  });
});

// Seed database with realistic data
app.post('/api/seed', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      // Start transaction
      await client.query('BEGIN');
      
      // Clear existing data
      await client.query('TRUNCATE reviews, bookings, experiences, bundles, payments, user_profiles, users CASCADE');
      
      // Reset sequences
      await client.query(`
        ALTER SEQUENCE users_id_seq RESTART WITH 1;
        ALTER SEQUENCE bundles_id_seq RESTART WITH 1;
        ALTER SEQUENCE experiences_id_seq RESTART WITH 1;
        ALTER SEQUENCE bookings_id_seq RESTART WITH 1;
        ALTER SEQUENCE reviews_id_seq RESTART WITH 1;
        ALTER SEQUENCE payments_id_seq RESTART WITH 1;
      `);
      
      // Get parameters from request or use defaults
      const options = req.body || {};
      const userCount = options.userCount || 20;
      const bundleCount = options.bundleCount || 10;
      
      // Seed users (Reuse existing seeding logic from db_seeder.js)
      // ... [seeding logic here, same as in db_seeder.js]
      
      // Commit transaction
      await client.query('COMMIT');
      res.json({ status: 'success', message: 'Database seeded with realistic data' });
      
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ status: 'error', message: error.message });
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Add specific seed endpoints for development needs
app.post('/api/seed/test-user', async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Create test user with predictable credentials
    const email = req.body.email || 'test@example.com';
    const password = req.body.password || 'password123';
    
    const result = await client.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [email, password]
    );
    
    const userId = result.rows[0].id;
    
    await client.query(
      'INSERT INTO user_profiles (user_id, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4)',
      [userId, 'Test', 'User', '1234567890']
    );
    
    client.release();
    res.json({ 
      status: 'success', 
      message: 'Test user created',
      user: { id: userId, email, password }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Database API server running at http://localhost:${port}`);
});