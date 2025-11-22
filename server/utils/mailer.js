import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sandhiyasambasivams@gmail.com',
    pass: 'abftvecfwsqdlnpy',
  },
});

export const sendEmail = async ({ name, email, message }) => {
  const mailOptions = {
    from: 'AI Portfolio <sandhiyasambasivams@gmail.com>',
    to: 'sandhiyasambasivams@gmail.com',
    subject: `New portfolio contact from ${name}`,
    html: `
      <h2>New Contact Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};