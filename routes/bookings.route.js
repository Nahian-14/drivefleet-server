const express = require('express');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

module.exports = (bookingsCollection) => {
  // GET bookings by user email (private)
  router.get('/:email', verifyToken, async (req, res) => {
    try {
      if (req.user.email !== req.params.email) {
        return res.status(403).send({ message: 'Forbidden' });
      }
      const bookings = await bookingsCollection
        .find({ userEmail: req.params.email })
        .sort({ bookingDate: -1 })
        .toArray();
      res.json(bookings);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

  // POST create booking (private)
  router.post('/', verifyToken, async (req, res) => {
    try {
      const booking = { ...req.body, bookingDate: new Date() };
      const result = await bookingsCollection.insertOne(booking);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

  return router;
};
