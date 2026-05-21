require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');

const carsRouter = require('./routes/cars.route');
const bookingsRouter = require('./routes/bookings.route');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ── MongoDB ───────────────────────────────────────────────────────────────────
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('drivefleetDB');
    const carsCollection = db.collection('cars');
    const bookingsCollection = db.collection('bookings');

    // ── JWT Routes ─────────────────────────────────────────────────────────────
    // Issue JWT cookie on login
    app.post('/api/jwt', (req, res) => {
      const { email } = req.body;
      if (!email) return res.status(400).send({ message: 'Email required' });

      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .send({ success: true });
    });

    // Clear JWT cookie on logout
    app.delete('/api/jwt', (req, res) => {
      res
        .clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true });
    });

    // ── API Routes ─────────────────────────────────────────────────────────────
    app.use('/api/cars', carsRouter(carsCollection));
    app.use('/api/bookings', bookingsRouter(bookingsCollection));

    // Health check
    app.get('/', (req, res) => {
      res.send({ status: 'DriveFleet API is running 🚗' });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).send({ message: 'Route not found' });
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send({ message: 'Internal server error' });
    });

    app.listen(PORT, () => {
      console.log(`🚀 DriveFleet server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
}

run();
