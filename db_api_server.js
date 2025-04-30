const express = require('express');
const { exec } = require('child_process');
const { Pool } = require('pg');
const { faker } = require('@faker-js/faker');

const app = express();
const port = process.env.PORT || 3000;

const DEBUG = true;
const log = (...args) => DEBUG && console.log('[DEBUG]', ...args);

const pool = new Pool({
  user: process.env.DB_USER || 'speakeasy',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'speakeasy_dev',
  password: process.env.DB_PASSWORD || 'secretpassword',
  port: 5432,
});

app.use(express.json());

app.get('/', async (req, res) => {
  return "Hello world"
  }
)

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
      res.json({ status: 'connected', counts: results.rows[0] });
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Database connection failed', error: err.message });
  }
});

app.post('/api/reset', (req, res) => {
  exec('docker exec speakeasy_db psql -U speakeasy -d speakeasy_dev -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" && docker exec speakeasy_db psql -U speakeasy -d speakeasy_dev -f /docker-entrypoint-initdb.d/init.sql',
    (error) => {
      if (error) {
        return res.status(500).json({ status: 'error', message: error.message });
      }
      res.json({ status: 'success', message: 'Database reset with basic data' });
    });
});

app.post('/api/seed', async (req, res) => {
  log('Starting seed process');
  let client;

  const clamp = (val, max) => (val || '').toString().substring(0, max);

  try {
    client = await pool.connect();
    await client.query('BEGIN');

    log('Truncating tables');
    await client.query('TRUNCATE reviews, bookings, experiences, experience_schedules, bundles, bundle_experiences, payments, payment_methods, referrals, tags, experience_tags, users CASCADE');

    log('Resetting sequences');
    await client.query(`
      ALTER SEQUENCE users_id_seq RESTART WITH 1;
      ALTER SEQUENCE bundles_id_seq RESTART WITH 1;
      ALTER SEQUENCE experiences_id_seq RESTART WITH 1;
      ALTER SEQUENCE bookings_id_seq RESTART WITH 1;
      ALTER SEQUENCE reviews_id_seq RESTART WITH 1;
      ALTER SEQUENCE payments_id_seq RESTART WITH 1;
    `);

    const userCount = req.body?.userCount || 20;
    const bundleCount = req.body?.bundleCount || 10;

    log(`Creating ${userCount} users`);
    for (let i = 0; i < userCount; i++) {
      try {
        const email = clamp(faker.internet.email(), 100);
        const password = clamp(faker.internet.password(), 255);
        const firstName = clamp(faker.person.firstName(), 50);
        const lastName = clamp(faker.person.lastName(), 50);
        const phone = clamp(faker.phone.number(), 20);
        const paymentInfo = clamp(faker.finance.accountNumber(), 255);
        const isAdmin = faker.datatype.boolean();

        const result = await client.query(
          `INSERT INTO users (email, password, first_name, last_name, phone, payment_info, admin)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [email, password, firstName, lastName, phone, paymentInfo, isAdmin]
        );

        const userId = result.rows[0].id;

        await client.query(
          `INSERT INTO payment_methods (user_id, card_number, cvv, billing_zip)
           VALUES ($1, $2, $3, $4)`,
          [
            userId,
            parseInt(faker.finance.creditCardNumber().replace(/\D/g, '')),
            parseInt(faker.finance.creditCardCVV()),
            parseInt(faker.location.zipCode('#####'))
          ]
        );

        await client.query(
          `INSERT INTO referrals (user_id, passcode) VALUES ($1, $2)`,
          [userId, clamp(faker.string.alpha(8), 20)]
        );
      } catch (userError) {
        log(`Error creating user ${i + 1}:`, userError);
        throw userError;
      }
    }

    log(`Creating ${bundleCount} bundles`);
    for (let i = 0; i < bundleCount; i++) {
      try {
        await client.query(
          'INSERT INTO bundles (name, description, total_price) VALUES ($1, $2, $3)',
          [
            clamp(faker.commerce.productName(), 100),
            faker.lorem.paragraph(),
            faker.number.float({ min: 100, max: 1000 })
          ]
        );
      } catch (bundleError) {
        log(`Error creating bundle ${i + 1}:`, bundleError);
        throw bundleError;
      }
    }

    await client.query('COMMIT');
    res.json({ status: 'success', message: 'Database seeded with test data' });
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    console.error('SEED ERROR:', error);
    console.error('FULL ERROR DETAILS:', JSON.stringify(error, null, 2));
    res.status(500).json({ status: 'error', message: error.message });
  } finally {
    if (client) client.release();
  }
});

app.post('/api/seed/test-user', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const email = 'devtest@example.com';
    const password = 'password123';
    const firstName = 'Dev';
    const lastName = 'Tester';
    const phone = '1234567890';
    const paymentInfo = 'TestCard';
    const isAdmin = false;

    const result = await client.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, payment_info, admin)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [email, password, firstName, lastName, phone, paymentInfo, isAdmin]
    );

    const userId = result.rows[0].id;

    await client.query(
      `INSERT INTO payment_methods (user_id, card_number, cvv, billing_zip)
       VALUES ($1, $2, $3, $4)`,
      [userId, 4111111111111111, 123, 90210]
    );

    res.json({ status: 'success', user: { email, password } });
  } catch (err) {
    console.error('Error creating test user:', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    if (client) client.release();
  }
});

app.listen(port, () => log(`API Server listening on port ${port}`));

module.exports = app;