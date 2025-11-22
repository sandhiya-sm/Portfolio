import { sendEmail } from '../utils/mailer.js';

const validateContactPayload = ({ name, email, message }) => {
  if (!name || name.trim().length < 2) {
    return 'Name must be at least 2 characters.';
  }
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email || !emailRegex.test(email)) {
    return 'Please provide a valid email address.';
  }
  if (!message || message.trim().length < 10) {
    return 'Message must be at least 10 characters.';
  }
  return null;
};

export const sendContactMessage = async (req, res) => {
  try {
    const validationError = validateContactPayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    await sendEmail(req.body);

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error. Please try again later.' });
  }
};