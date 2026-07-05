const nodemailer = require('nodemailer');
// const twilio = require('twilio'); // Commented out to avoid crashing without real keys

// Ethereal Email Setup for testing
// In production, you would use standard SMTP credentials
const sendEmail = async (to, subject, html) => {
  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: '"MediSlot AI" <no-reply@medislot.ai>',
      to: to,
      subject: subject,
      html: html,
    });

    console.log("====================================");
    console.log("EMAIL SENT SUCCESSFULLY!");
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("====================================");
    
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const sendWhatsApp = async (to, message) => {
  try {
    // Note: To use Twilio WhatsApp API, you need:
    // 1. Twilio Account SID
    // 2. Twilio Auth Token
    // 3. Twilio WhatsApp sandbox activated
    
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const twilioMessage = await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', // Twilio Sandbox Number
      to: `whatsapp:${to}`
    });
    
    console.log("WhatsApp message sent: ", twilioMessage.sid);
    */

    // MOCK IMPLEMENTATION FOR NOW
    console.log("====================================");
    console.log("WHATSAPP MESSAGE SENT (MOCKED)!");
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    console.log("====================================");
    
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp:", error);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendWhatsApp
};
