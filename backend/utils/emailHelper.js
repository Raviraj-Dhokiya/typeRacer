// backend/utils/emailHelper.js
// Handles sending OTP emails.
// It prefers Nodemailer (via Gmail App Passwords) because sending emails FROM a @gmail.com 
// address using third-party APIs like Brevo often results in emails being silently dropped 
// by receiving servers due to Google's strict DMARC policies.

import nodemailer from 'nodemailer';

export const sendOtpEmail = async (email, otp) => {
  console.log(`\n🔔 ===== OTP Email Trigger =====`);
  console.log(`   To:              ${email}`);
  console.log(`   OTP:             ${otp}`);
  
  if (process.env.EMAIL_PASS && process.env.EMAIL_USER) {
    console.log(`   Method:          ✅ Gmail (Nodemailer)`);
  } else {
    console.log(`   Method:          ❌ NONE (Credentials missing)`);
  }
  console.log(`================================\n`);

  const htmlContent = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0f172a;color:#f1f5f9;border-radius:12px;">
      <h2 style="color:#3b82f6;margin-bottom:8px;">⌨ TypeRacer</h2>
      <h3 style="margin-bottom:20px;">Your Verification OTP</h3>
      <p style="color:#94a3b8;margin-bottom:16px;">Use the code below to verify your email address:</p>
      <div style="background:#1e293b;border:2px solid #3b82f6;border-radius:10px;padding:24px;text-align:center;margin-bottom:24px;">
        <span style="font-size:40px;font-weight:900;letter-spacing:10px;color:#f1f5f9;">${otp}</span>
      </div>
      <p style="color:#94a3b8;font-size:13px;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      <hr style="border-color:#1e293b;margin:24px 0;" />
      <p style="color:#475569;font-size:12px;">If you did not request this, you can safely ignore this email.</p>
    </div>
  `;

  if (process.env.EMAIL_PASS && process.env.EMAIL_USER) {
    console.log(`📤 Calling Gmail SMTP server...`);
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, // Expected 16-char App Password from .env
        },
      });

      const info = await transporter.sendMail({
        from: `"TypeRacer" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your TypeRacer Verification OTP',
        html: htmlContent,
      });

      console.log(`✅ OTP email sent successfully to ${email} via Gmail!`);
      console.log(`   Message ID: ${info.messageId}`);
    } catch (err) {
      console.error(`❌ Gmail SMTP Error: ${err.message}`);
      console.warn(`\n   👉 OTP for manual testing: ${otp}`);
    }
  } else {
    console.warn(`⚠️ EMAIL_PASS or EMAIL_USER is not configured correctly in .env.`);
    console.warn(`\n   👉 OTP for manual testing: ${otp}`);
  }
};
