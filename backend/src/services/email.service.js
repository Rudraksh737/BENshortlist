// Sends transactional emails through SendGrid.
import sgMail from '@sendgrid/mail';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

// Initialize SendGrid
if (env.sendgridApiKey) {
  sgMail.setApiKey(env.sendgridApiKey);
}

export const EMAIL_FROM_ADDRESS = env.emailFrom || 'noreply@example.com';

// Send email via SendGrid.
export const sendEmail = async ({
  to,
  subject,
  html,
  from = EMAIL_FROM_ADDRESS,
  context = 'transactional'
}) => {
  try {
    if (!env.sendgridApiKey) {
      throw new ApiError(503, 'Email delivery is not configured. Set SENDGRID_API_KEY.');
    }

    const msg = {
      to,
      from,
      subject,
      html
    };

    const response = await sgMail.send(msg);
    logger.info(`[Email:${context}] Email sent successfully via SendGrid`);
  } catch (error) {
    logger.error(`[Email:${context}] SendGrid delivery failed: ${error.message}`);
    throw new ApiError(503, 'Failed to send email. Please try again later.');
  }
};