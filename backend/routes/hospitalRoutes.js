const express = require('express');
const router = express.Router();
const { getNearbyHospitals, getHospitalById, getRecommendedSlots } = require('../controllers/hospitalController');

// @route   GET /api/hospitals/nearby
// @desc    Get nearby hospitals based on lat and lng
router.get('/nearby', getNearbyHospitals);

// @route   GET /api/hospitals/:id/recommended-slots
// @desc    Get smart slot recommendations for a hospital
router.get('/:id/recommended-slots', getRecommendedSlots);

// @route   GET /api/hospitals/:id
// @desc    Get hospital details by ID
router.get('/:id', getHospitalById);

module.exports = router;
