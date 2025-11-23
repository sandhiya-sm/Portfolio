import nodemailer from 'nodemailer';

const host = process.env.MAIL_HOST || 'smtp.sendgrid.net';
const port = parseInt(process.env.MAIL_PORT || '587', 10);
const secure = (process.env.MAIL_SECURE || 'false') === 'true';

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

transporter.verify()
  .then(() => console.log('Mailer: SMTP connection OK'))
  .catch(err => console.error('Mailer: SMTP verify failed', err));

export async function sendContactEmail({ name, email, message }) {
  const mailOptions = {
    from: `"${name}" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_RECIPIENT || process.env.MAIL_USER,
    subject: `New contact from ${name} (${email})`,
    text: `${message}\n\nFrom: ${name} <${email}>`
  };
  return transporter.sendMail(mailOptions);
}