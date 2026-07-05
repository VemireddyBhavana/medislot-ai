const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

// @route   GET /api/hospitals/nearby
// @desc    Get nearby hospitals based on lat and lng
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, distance = 50000 } = req.query; // Default 50km

    if (!lat || !lng) {
      // If no location provided, just return all hospitals
      const hospitals = await Hospital.find();
      return res.json(hospitals);
    }

    // Convert string to float
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Find hospitals within the distance (in meters)
    const hospitals = await Hospital.find({
      location: {
        $near: {
          $maxDistance: parseInt(distance),
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude] // Note: GeoJSON uses [lng, lat]
          }
        }
      }
    });

    res.json(hospitals);
  } catch (error) {
    console.error('Error fetching nearby hospitals:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/hospitals/:id
// @desc    Get hospital details by ID
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json(hospital);
  } catch (error) {
    console.error('Error fetching hospital:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
