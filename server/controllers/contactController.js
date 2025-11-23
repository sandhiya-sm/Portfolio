import { sendContactEmail } from '../utils/mailer.js';

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

export default async function contactHandler(req, res) {
  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing name, email or message' });
    }

    const validationError = validateContactPayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const info = await sendContactEmail({ name, email, message });
    console.log('Email sent:', info && (info.messageId || info.response) || info);

    return res.json({ success: true });
  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
}