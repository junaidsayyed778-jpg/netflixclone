// utils/sendOTP.js (or wherever you have it)
const nodemailer = require("nodemailer");

async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🔐 Your Verification Code",
    html: `
      <div style="font-family: Arial; max-width: 500px; margin: auto;">
        <h2 style="color: #e50914;">Verify Your Email</h2>
        <p>Your verification code:</p>
        <h1 style="letter-spacing: 6px; font-size: 28px; background: #f4f4f4; padding: 12px; text-align: center;">
          ${otp}
        </h1>
        <p style="color: #666; font-size: 14px;">Expires in 5 minutes</p>
      </div>
    `,
  });
}

module.exports = sendOTP;