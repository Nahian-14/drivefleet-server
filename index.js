require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');

const carsRouter = require('./routes/cars.route');
const bookingsRouter = require('./routes/bookings.route');

const app = express();
app.set('trust proxy', 1);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.options('*', cors());
app.use(express.json());
app.use(cookieParser());


// ── MongoDB (connect once, reuse across requests) ─────────────────────────────
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  }
  return client.db('drivefleetDB');
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.post('/api/jwt', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send({ message: 'Email required' });
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }).send({ success: true });
});

app.delete('/api/jwt', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  }).send({ success: true });
});

app.use('/api/cars', async (req, res, next) => {
  const db = await connectDB();
  return carsRouter(db.collection('cars'))(req, res, next);
});

app.use('/api/bookings', async (req, res, next) => {
  const db = await connectDB();
  return bookingsRouter(db.collection('bookings'))(req, res, next);
});

app.get('/', (req, res) => {
  res.send({ status: 'DriveFleet API is running 🚗' });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Internal server error' });
});

// ── Export for Vercel (no app.listen!) ────────────────────────────────────────
module.exports = app;
