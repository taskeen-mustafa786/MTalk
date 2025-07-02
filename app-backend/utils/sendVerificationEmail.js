const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async function sendVerificationEmail(to, token) {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  await transporter.sendMail({
    to,
    subject: 'Verify your email',
    html: `<h1>Welcome to WhatsApp? Community <h1><p>Please verify your email by clicking the link: <a href="${url}">${url}</a></p>`
  });
};
