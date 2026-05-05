// backend/utils/emailHelper.js
// Handles sending OTP emails.
// It prefers Nodemailer (via Gmail App Passwords) because sending emails FROM a @gmail.com 
// address using third-party APIs like Brevo often results in emails being silently dropped 
// by receiving servers due to Google's strict DMARC policies.

import nodemailer from 'nodemailer';
import dns from 'dns';

// Fix for Render / Cloud providers where IPv6 is not properly routed (fixes ENETUNREACH)
dns.setDefaultResultOrder('ipv4first');

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
    try {
      // 1. Try Brevo API First (Bypasses Render's SMTP Port 465 Block by using standard HTTPS Port 443)
      if (process.env.BREVO_API_KEY) {
        console.log(`📤 Calling Brevo API over HTTPS (Bypasses Render Block)...`);
        
        const payload = {
          sender: {
            name: 'TypeRacer',
            email: process.env.EMAIL_USER || 'ravirajdhokiya9@gmail.com',
          },
          to: [{ email }],
          subject: 'Your TypeRacer Verification OTP',
          htmlContent: htmlContent,
        };

        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          console.log(`✅ OTP email sent via Brevo successfully to ${email}`);
          return; // Exit if Brevo succeeds
        } else {
          console.error(`❌ Brevo API returned error ${res.status}`);
          // Fall through to Nodemailer...
        }
      }

      // 2. Fallback to Nodemailer (Works locally, but blocked on Render Free Tier)
      console.log(`📤 Calling Gmail SMTP server...`);
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, 
        },
        tls: { rejectUnauthorized: false },
        family: 4, 
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
      console.error(`❌ Email Error: ${err.message}`);
      console.warn(`\n   👉 OTP for manual testing: ${otp}`);
    }
  } else {
    console.warn(`⚠️ EMAIL_PASS or EMAIL_USER is not configured correctly in .env.`);
    console.warn(`\n   👉 OTP for manual testing: ${otp}`);
  }
};
