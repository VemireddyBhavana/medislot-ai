const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointments, getAppointmentById, updateAppointment, getAppointmentsByDoctor } = require('../controllers/appointmentController');

router.post('/book', bookAppointment);
router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.get('/doctor/:doctorId', getAppointmentsByDoctor);

module.exports = router;
