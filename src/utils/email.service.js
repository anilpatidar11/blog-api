const nodemailer = require("nodemailer");
const config = require("../config/env");


const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
port: Number(config.EMAIL_PORT),
secure: Number(config.EMAIL_PORT) === 465,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});


transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP READY");
  }
});


const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: config.EMAIL_FROM,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};


const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${config.CLIENT_URL}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #333;">Hello, ${user.name} 👋</h2>
      <p style="color: #555; line-height: 1.6;">
        Thank you for registering. Please verify your email address by clicking the button below.
      </p>
      <a href="${verifyUrl}"
         style="display: inline-block; margin: 20px 0; padding: 12px 28px;
                background-color: #4f46e5; color: #fff; text-decoration: none;
                border-radius: 6px; font-weight: bold;">
        Verify Email
      </a>
      <p style="color: #999; font-size: 13px;">
        This link expires in <strong>24 hours</strong>.<br/>
        If you did not create this account, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
      <p style="color: #bbb; font-size: 12px;">
        If the button doesn't work, copy this link:<br/>
        <a href="${verifyUrl}" style="color: #4f46e5;">${verifyUrl}</a>
      </p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: "Verify your email address",
    html,
  });
};


const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${config.CLIENT_URL}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p style="color: #555; line-height: 1.6;">
        Hi <strong>${user.name}</strong>, we received a request to reset your password.
        Click the button below to set a new password.
      </p>
      <a href="${resetUrl}"
         style="display: inline-block; margin: 20px 0; padding: 12px 28px;
                background-color: #e53e3e; color: #fff; text-decoration: none;
                border-radius: 6px; font-weight: bold;">
        Reset Password
      </a>
      <p style="color: #999; font-size: 13px;">
        This link expires in <strong>1 hour</strong>.<br/>
        If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
      <p style="color: #bbb; font-size: 12px;">
        If the button doesn't work, copy this link:<br/>
        <a href="${resetUrl}" style="color: #e53e3e;">${resetUrl}</a>
      </p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: "Password Reset Link (valid for 1 hour)",
    html,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};