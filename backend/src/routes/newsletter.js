import express from 'express';
import { body, validationResult } from 'express-validator';
import axios from 'axios';
import logger from '../utils/logger.js';

const router = express.Router();

// Email Octopus configuration
const EMAIL_OCTOPUS_API_KEY = process.env.EMAIL_OCTOPUS_API_KEY;
const EMAIL_OCTOPUS_LIST_ID = process.env.EMAIL_OCTOPUS_LIST_ID;
const EMAIL_OCTOPUS_API_URL = 'https://emailoctopus.com/api/1.6';

// Newsletter subscription
router.post('/subscribe', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters'),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters'),
  body('source').optional().trim().isIn(['website', 'checkout', 'popup', 'footer']).withMessage('Invalid source'),
  body('consent').isBoolean().withMessage('Marketing consent is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, firstName, lastName, source = 'website', consent } = req.body;

    // Check if user already exists in Email Octopus
    const checkResponse = await axios.get(`${EMAIL_OCTOPUS_API_URL}/lists/${EMAIL_OCTOPUS_LIST_ID}/contacts`, {
      params: {
        api_key: EMAIL_OCTOPUS_API_KEY,
        email_address: email
      }
    });

    if (checkResponse.data.data && checkResponse.data.data.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already subscribed'
      });
    }

    // Add subscriber to Email Octopus
    const subscribeResponse = await axios.post(`${EMAIL_OCTOPUS_API_URL}/lists/${EMAIL_OCTOPUS_LIST_ID}/contacts`, {
      api_key: EMAIL_OCTOPUS_API_KEY,
      email_address: email,
      status: 'SUBSCRIBED',
      fields: {
        FirstName: firstName || '',
        LastName: lastName || '',
        Source: source,
        Consent: consent ? 'Yes' : 'No',
        SubscribeDate: new Date().toISOString()
      }
    });

    if (subscribeResponse.data.error) {
      logger.error('Email Octopus subscription error:', subscribeResponse.data.error);
      return res.status(500).json({
        success: false,
        message: 'Failed to subscribe to newsletter'
      });
    }

    // Log successful subscription
    logger.info(`Newsletter subscription: ${email} from ${source}`);

    // Send welcome email via Email Octopus automation
    await axios.post(`${EMAIL_OCTOPUS_API_URL}/lists/${EMAIL_OCTOPUS_LIST_ID}/contacts/${subscribeResponse.data.id}/send-welcome-email`, {
      api_key: EMAIL_OCTOPUS_API_KEY
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        email,
        subscriberId: subscribeResponse.data.id
      }
    });

  } catch (error) {
    logger.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Find subscriber in Email Octopus
    const findResponse = await axios.get(`${EMAIL_OCTOPUS_API_URL}/lists/${EMAIL_OCTOPUS_LIST_ID}/contacts`, {
      params: {
        api_key: EMAIL_OCTOPUS_API_KEY,
        email_address: email
      }
    });

    if (!findResponse.data.data || findResponse.data.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in newsletter list'
      });
    }

    const subscriberId = findResponse.data.data[0].id;

    // Unsubscribe from Email Octopus
    await axios.put(`${EMAIL_OCTOPUS_API_URL}/lists/${EMAIL_OCTOPUS_LIST_ID}/contacts/${subscriberId}`, {
      api_key: EMAIL_OCTOPUS_API_KEY,
      status: 'UNSUBSCRIBED'
    });

    logger.info(`Newsletter unsubscription: ${email}`);

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    logger.error('Newsletter unsubscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get newsletter statistics
router.get('/stats', async (req, res) => {
  try {
    const statsResponse = await axios.get(`${EMAIL_OCTOPUS_API_URL}/lists/${EMAIL_OCTOPUS_LIST_ID}`, {
      params: {
        api_key: EMAIL_OCTOPUS_API_KEY
      }
    });

    res.json({
      success: true,
      data: {
        totalSubscribers: statsResponse.data.subscriber_count,
        openRate: statsResponse.data.stats.open_rate,
        clickRate: statsResponse.data.stats.click_rate
      }
    });

  } catch (error) {
    logger.error('Newsletter stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch newsletter statistics'
    });
  }
});

export default router; 