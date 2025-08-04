import nodemailer from 'nodemailer';
import { logger } from './logger.js';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  'welcome': (data) => ({
    subject: 'Welcome to KOLZO - Your Luxury Fashion Destination',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to KOLZO</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your Premium Fashion Journey Begins</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${data.userName},</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Welcome to KOLZO! We're thrilled to have you join our exclusive community of fashion enthusiasts. 
            Discover curated luxury fashion, premium accessories, and sophisticated lifestyle products.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">Your Account Details</h3>
            <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Member Since:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/verify-email?token=${data.verificationToken}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Verify Your Email
            </a>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">What's Next?</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Browse our exclusive collections</li>
              <li>Enjoy free shipping on orders over ₹16,600</li>
              <li>Get early access to sales and new arrivals</li>
              <li>Earn rewards with every purchase</li>
            </ul>
          </div>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px;">
            © 2024 KOLZO. All rights reserved. | 
            <a href="${process.env.FRONTEND_URL}/privacy" style="color: white;">Privacy Policy</a> | 
            <a href="${process.env.FRONTEND_URL}/terms" style="color: white;">Terms of Service</a>
          </p>
        </div>
      </div>
    `
  }),

  'email-verification': (data) => ({
    subject: 'Verify Your Email - KOLZO',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Email Verification</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${data.userName},</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Please verify your email address to complete your KOLZO account setup.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/verify-email?token=${data.verificationToken}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${process.env.FRONTEND_URL}/verify-email?token=${data.verificationToken}" style="color: #667eea;">
              ${process.env.FRONTEND_URL}/verify-email?token=${data.verificationToken}
            </a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This link will expire in 24 hours.
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px;">
            © 2024 KOLZO. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  'password-reset': (data) => ({
    subject: 'Reset Your Password - KOLZO',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${data.userName},</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/reset-password?token=${data.resetToken}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            If you didn't request this password reset, you can safely ignore this email.
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This link will expire in 1 hour.
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px;">
            © 2024 KOLZO. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  'order-confirmation': (data) => ({
    subject: `Order Confirmation #${data.orderNumber} - KOLZO`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Order #${data.orderNumber}</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Thank you for your order!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We're excited to prepare your order. You'll receive another email when your items ship.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">Order Summary</h3>
            <p style="color: #666; margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Order Date:</strong> ${data.orderDate}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Total Amount:</strong> ₹${data.totalAmount}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Payment Method:</strong> ${data.paymentMethod}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">Shipping Address</h3>
            <p style="color: #666; margin: 5px 0;">${data.shippingAddress}</p>
          </div>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px;">
            © 2024 KOLZO. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  'order-status-update': (data) => ({
    subject: `Order Update #${data.orderNumber} - KOLZO`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Update</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Order #${data.orderNumber}</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Your order status has been updated</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            ${data.statusMessage}
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">Current Status</h3>
            <p style="color: #666; margin: 5px 0;"><strong>Status:</strong> ${data.status}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Updated:</strong> ${data.updateDate}</p>
            ${data.trackingNumber ? `<p style="color: #666; margin: 5px 0;"><strong>Tracking:</strong> ${data.trackingNumber}</p>` : ''}
          </div>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px;">
            © 2024 KOLZO. All rights reserved.
          </p>
        </div>
      </div>
    `
  }),

  'order-cancellation': (data) => ({
    subject: `Order Cancelled #${data.orderNumber} - KOLZO`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Cancelled</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Order #${data.orderNumber}</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Your order has been cancelled</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We're sorry to see you go. Your refund will be processed within 5-7 business days.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">Cancellation Details</h3>
            <p style="color: #666; margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Cancelled Date:</strong> ${data.cancelledDate}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Refund Amount:</strong> ₹${data.refundAmount}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Reason:</strong> ${data.cancellationReason}</p>
          </div>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px;">
            © 2024 KOLZO. All rights reserved.
          </p>
        </div>
      </div>
    `
  })
};

// Main email sending function
const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    const transporter = createTransporter();
    
    let emailContent = {};
    
    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else {
      emailContent = { subject, html, text };
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };
    
    const result = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}`);
    return result;
  } catch (error) {
    logger.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
};

// Specific email functions
const sendWelcomeEmail = async (user, verificationToken) => {
  return sendEmail({
    to: user.email,
    template: 'welcome',
    data: {
      userName: user.name,
      email: user.email,
      verificationToken
    }
  });
};

const sendEmailVerification = async (user, verificationToken) => {
  return sendEmail({
    to: user.email,
    template: 'email-verification',
    data: {
      userName: user.name,
      verificationToken
    }
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  return sendEmail({
    to: user.email,
    template: 'password-reset',
    data: {
      userName: user.name,
      resetToken
    }
  });
};

const sendOrderConfirmationEmail = async (user, orderData) => {
  return sendEmail({
    to: user.email,
    template: 'order-confirmation',
    data: {
      userName: user.name,
      orderNumber: orderData.orderNumber,
      orderDate: orderData.orderDate,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress
    }
  });
};

const sendOrderStatusUpdateEmail = async (user, orderData) => {
  return sendEmail({
    to: user.email,
    template: 'order-status-update',
    data: {
      userName: user.name,
      orderNumber: orderData.orderNumber,
      status: orderData.status,
      statusMessage: orderData.statusMessage,
      updateDate: orderData.updateDate,
      trackingNumber: orderData.trackingNumber
    }
  });
};

const sendOrderCancellationEmail = async (user, orderData) => {
  return sendEmail({
    to: user.email,
    template: 'order-cancellation',
    data: {
      userName: user.name,
      orderNumber: orderData.orderNumber,
      cancelledDate: orderData.cancelledDate,
      refundAmount: orderData.refundAmount,
      cancellationReason: orderData.cancellationReason
    }
  });
};

export {
  sendEmail,
  sendWelcomeEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendOrderCancellationEmail
}; 