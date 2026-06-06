import nodemailer from 'nodemailer';

// You can configure this with your actual SMTP credentials later (e.g. SendGrid, Gmail)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 465,
  secure: true, // true for 465, false for other ports
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendVerificationEmail = async (toEmail, name, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"US Towing Services" <${process.env.SMTP_USER || 'noreply@gruasapp.com'}>`,
    to: toEmail,
    subject: 'Please verify your email address',
    text: `Hello ${name},\n\nPlease verify your email address by clicking the link below:\n\n${verifyUrl}\n\nThis link will expire in 24 hours.\n\nIf you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${name},</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">This link will expire in 24 hours.<br>If you did not request this, please ignore this email.</p>
      </div>
    `
  };

  try {
    // If SMTP credentials exist, send the real email
    if (process.env.SMTP_USER) {
      await transporter.sendMail(mailOptions);
      console.log(`[MAILER] Verification email sent to ${toEmail}`);
    } else {
      // Mock email for local development
      console.log('\n========================================================');
      console.log('📧 [MOCK MAILER] EMAIL INTERCEPTED (Local Development)');
      console.log(`To: ${toEmail}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`\n🔗 VERIFICATION LINK: \n${verifyUrl}`);
      console.log('========================================================\n');
    }
    return true;
  } catch (error) {
    console.error('[MAILER] Error sending verification email:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (toEmail, name, code) => {
  const mailOptions = {
    from: `"US Towing Services" <${process.env.SMTP_USER || 'noreply@gruasapp.com'}>`,
    to: toEmail,
    subject: 'Your Password Reset Code',
    text: `Hello ${name},\n\nYour password reset code is: ${code}\n\nThis code will expire in 15 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${name},</h2>
        <p>You requested to reset your password. Here is your 6-digit secure code:</p>
        <h1 style="letter-spacing: 5px; color: #2563eb; background: #f3f4f6; padding: 10px 20px; display: inline-block; border-radius: 8px;">${code}</h1>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">This code will expire in 15 minutes.<br>If you did not request this, please ignore this email.</p>
      </div>
    `
  };

  try {
    if (process.env.SMTP_USER) {
      await transporter.sendMail(mailOptions);
      console.log(`[MAILER] Password reset email sent to ${toEmail}`);
    } else {
      console.log('\n========================================================');
      console.log('📧 [MOCK MAILER] EMAIL INTERCEPTED (Local Development)');
      console.log(`To: ${toEmail}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`\n🔑 RECOVERY CODE: ${code}`);
      console.log('========================================================\n');
    }
    return true;
  } catch (error) {
    console.error('[MAILER] Error sending password reset email:', error);
    return false;
  }
};
