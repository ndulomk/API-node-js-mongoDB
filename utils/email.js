import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendConfirmationEmail = async (email, confirmationToken) => {
  const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email/${confirmationToken}`;
  
  const mailOptions = {
    from: `"ECO-RES" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Confirm Your Account',
    html: `
      <h1>Welcome to ECO-RES!</h1>
      <p>Please confirm your email by clicking the link below:</p>
      <a href="${confirmationUrl}" style="
        display: inline-block;
        padding: 10px 20px;
        background-color: #119e12;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 15px;
      ">Confirm Email</a>
      <p style="margin-top: 20px;">
        If you didn't create this account, please ignore this email.
      </p>
    `,
  };

  await transporter.sendMail(mailOptions);
};