const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // SMTP server
  port: 587, // Port for TLS
  secure: false, // Use TLS (for port 587), change to true for SSL (port 465)
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your password or App Password
  },
  tls: {
    rejectUnauthorized: false, // Prevents error in development environment
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error.message);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = sendEmail;
