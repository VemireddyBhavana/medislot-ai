const fs = require('fs');

const f = 'backend/controllers/appointmentController.js';
let content = fs.readFileSync(f, 'utf8');

// Fix stripped backticks
content = content.replace(/message: \New appointment booked for \$\{patientName\} with \$\{doctor\.name\} on \$\{appointmentDate\} at \$\{appointmentTime\}\.\,/g, 'message: \\x60New appointment booked for  with  on  at .\\x60,');
content = content.replace(/message: \Patient \$\{updatedAppointment\.patientName\} was a no-show for appointment with \$\{updatedAppointment\.doctorName\}\.\,/g, 'message: \\x60Patient  was a no-show for appointment with .\\x60,');
content = content.replace(/\\x60/g, String.fromCharCode(96));

fs.writeFileSync(f, content, 'utf8');
