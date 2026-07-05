const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const Doctor = require('../models/Doctor');
const { sendEmail, sendWhatsApp } = require('../utils/notificationService');

// @route   POST /api/appointments/book
exports.bookAppointment = async (req, res) => {
  try {
    const { 
      patientName, patientEmail, patientPhone, doctorId, 
      appointmentDate, appointmentTime, notes, priority, noShowRisk 
    } = req.body;

    // 1. Prevent Double Booking
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: { $ne: 'cancelled' } // Allow booking if previous was cancelled
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        message: 'Double booking detected. The doctor is already booked for this time slot.' 
      });
    }

    // Get doctor info for denormalization
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // 2. Create Appointment
    const newAppointment = new Appointment({
      patientName,
      patientEmail,
      patientPhone,
      doctorId,
      hospitalId: req.body.hospitalId,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      appointmentDate,
      appointmentTime,
      notes,
      priority: priority || 'routine',
      noShowRisk: noShowRisk || 'low',
      status: 'booked'
    });

    const savedAppointment = await newAppointment.save();

    // 3. Create a Notification/Reminder entry automatically in DB
    const notification = new Notification({
      appointmentId: savedAppointment._id,
      message: `New appointment booked for ${patientName} with ${doctor.name} on ${appointmentDate} at ${appointmentTime}.`,
      type: 'reminder',
      status: 'pending'
    });
    await notification.save();

    // 4. Send External Notifications (WhatsApp & Email)
    const emailSubject = 'Booking Confirmation - MediSlot AI';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Appointment Confirmed!</h2>
        </div>
        <div style="padding: 20px;">
          <p>Dear <strong>${patientName}</strong>,</p>
          <p>Your appointment has been successfully booked. Here are the details:</p>
          <ul style="background-color: #f8fafc; padding: 15px 15px 15px 35px; border-radius: 8px;">
            <li><strong>Doctor:</strong> ${doctor.name} (${doctor.specialization})</li>
            <li><strong>Date:</strong> ${appointmentDate}</li>
            <li><strong>Time:</strong> ${appointmentTime}</li>
          </ul>
          <p>Please arrive 10 minutes before your scheduled time.</p>
          <p>Thank you for choosing MediSlot AI!</p>
        </div>
      </div>
    `;
    
    // Send email async without blocking the response
    if (patientEmail && patientEmail !== 'no-email@provided.com') {
      sendEmail(patientEmail, emailSubject, emailHtml);
    }
    
    if (patientPhone) {
      const waMessage = `*Appointment Confirmed!*\n\nHi ${patientName},\nYour appointment with ${doctor.name} is scheduled for *${appointmentDate}* at *${appointmentTime}*.\n\nThank you, MediSlot AI.`;
      sendWhatsApp(patientPhone, waMessage);
    }

    res.status(201).json({ 
      message: 'Appointment booked successfully', 
      appointment: savedAppointment 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @route   GET /api/appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @route   GET /api/appointments/:id
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @route   PUT /api/appointments/:id
exports.updateAppointment = async (req, res) => {
  try {
    // Supports updating status (completed, cancelled, no-show)
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!updatedAppointment) return res.status(404).json({ message: 'Appointment not found' });
    
    // Auto trigger notification if status changed to no-show
    if (req.body.status === 'no-show') {
      await Notification.create({
        appointmentId: updatedAppointment._id,
        message: `Patient ${updatedAppointment.patientName} was a no-show for appointment with ${updatedAppointment.doctorName}.`,
        type: 'alert',
        status: 'pending'
      });
    }

    res.json({ message: 'Appointment updated successfully', appointment: updatedAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @route   GET /api/appointments/doctor/:doctorId
exports.getAppointmentsByDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
