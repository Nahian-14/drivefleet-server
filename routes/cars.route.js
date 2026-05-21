const express = require('express');
const { ObjectId } = require('mongodb');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

module.exports = (carsCollection) => {
  // GET all cars (with optional search & filter)
  router.get('/', async (req, res) => {
    try {
      const { search, type } = req.query;
      const query = {};
      if (search) {
        query.carName = { $regex: search, $options: 'i' };
      }
      if (type && type !== 'All') {
        query.carType = { $in: [type] };
      }
      const cars = await carsCollection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
      res.json(cars);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

  // GET cars by owner email (private)
  router.get('/user/:email', verifyToken, async (req, res) => {
    try {
      if (req.user.email !== req.params.email) {
        return res.status(403).send({ message: 'Forbidden' });
      }
      const cars = await carsCollection
        .find({ ownerEmail: req.params.email })
        .sort({ createdAt: -1 })
        .toArray();
      res.json(cars);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

  // GET single car
  router.get('/:id', async (req, res) => {
    try {
      const car = await carsCollection.findOne({ _id: new ObjectId(req.params.id) });
      if (!car) return res.status(404).send({ message: 'Car not found' });
      res.json(car);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

  // POST add car (private)
  router.post('/', verifyToken, async (req, res) => {
    try {
      const car = { ...req.body, createdAt: new Date() };
      const result = await carsCollection.insertOne(car);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

  // PUT update car (private, owner only)
  router.put('/:id', verifyToken, async (req, res) => {
    try {
      const existing = await carsCollection.findOne({ _id: new ObjectId(req.params.id) });
      if (!existing) return res.status(404).send({ message: 'Car not found' });
      if (existing.ownerEmail !== req.user.email) {
        return res.status(403).send({ message: 'Forbidden — not your listing' });
      }
      const { dailyRentPrice, description, availability, imageURL, carType, pickupLocation } = req.body;
      const result = await carsCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { dailyRentPrice, description, availability, imageURL, carType, pickupLocation } }
      );
      res.json(result);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

  // PATCH increment booking_count (private)
  router.patch('/:id', verifyToken, async (req, res) => {
    try {
      const result = await carsCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $inc: { booking_count: 1 } }
      );
      res.json(result);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

  // DELETE car (private, owner only)
  router.delete('/:id', verifyToken, async (req, res) => {
    try {
      const existing = await carsCollection.findOne({ _id: new ObjectId(req.params.id) });
      if (!existing) return res.status(404).send({ message: 'Car not found' });
      if (existing.ownerEmail !== req.user.email) {
        return res.status(403).send({ message: 'Forbidden — not your listing' });
      }
      const result = await carsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json(result);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

  return router;
};
