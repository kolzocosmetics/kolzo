// Brevo Email Templates for KOLZO

export const emailTemplates = {
  // Welcome Email Template
  welcome: (firstName?: string) => ({
    subject: 'Welcome to KOLZO - Join the House',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to KOLZO</title>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f9f9f9;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            padding: 40px 20px;
          }
          .header { 
            text-align: center; 
            padding-bottom: 30px; 
            border-bottom: 1px solid #eee;
          }
          .logo { 
            font-size: 32px; 
            font-weight: 300; 
            letter-spacing: 0.2em; 
            color: #000; 
            margin-bottom: 10px;
          }
          .subtitle { 
            font-size: 16px; 
            color: #666; 
            font-weight: 300;
          }
          .content { 
            padding: 30px 0;
          }
          .greeting { 
            font-size: 18px; 
            margin-bottom: 20px;
          }
          .benefits { 
            background-color: #f8f8f8; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 5px;
          }
          .benefit-item { 
            margin: 10px 0; 
            padding-left: 20px; 
            position: relative;
          }
          .benefit-item:before { 
            content: "✓"; 
            position: absolute; 
            left: 0; 
            color: #000; 
            font-weight: bold;
          }
          .cta-button { 
            display: inline-block; 
            background-color: #000; 
            color: #fff; 
            padding: 15px 30px; 
            text-decoration: none; 
            text-transform: uppercase; 
            letter-spacing: 0.2em; 
            font-weight: 300; 
            margin: 20px 0;
          }
          .footer { 
            text-align: center; 
            padding-top: 30px; 
            border-top: 1px solid #eee; 
            font-size: 12px; 
            color: #666;
          }
          .social-links { 
            margin: 20px 0;
          }
          .social-links a { 
            display: inline-block; 
            margin: 0 10px; 
            color: #000; 
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">KOLZO</div>
            <div class="subtitle">Luxury Fashion & Lifestyle</div>
          </div>
          
          <div class="content">
            <div class="greeting">
              Dear ${firstName || 'Valued Customer'},
            </div>
            
            <p>Welcome to the House of KOLZO. We're delighted to have you join our community of discerning individuals who appreciate timeless elegance.</p>
            
            <p>As a subscriber, you'll be the first to discover:</p>
            
            <div class="benefits">
              <div class="benefit-item">New collections and exclusive launches</div>
              <div class="benefit-item">Private event invitations</div>
              <div class="benefit-item">Personalized style recommendations</div>
              <div class="benefit-item">Early access to sales and promotions</div>
              <div class="benefit-item">VIP customer service</div>
            </div>
            
            <p>To get started, explore our latest collection:</p>
            
            <div style="text-align: center;">
              <a href="https://kolzo.in" class="cta-button">Shop Now</a>
            </div>
            
            <p>Thank you for choosing KOLZO.</p>
            
            <p>Best regards,<br>The KOLZO Team</p>
          </div>
          
          <div class="footer">
            <div class="social-links">
              <a href="#">Instagram</a>
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
            </div>
            <p>© 2024 KOLZO. All rights reserved.</p>
            <p>You can <a href="#">unsubscribe</a> at any time.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
      Welcome to KOLZO!
      
      Dear ${firstName || 'Valued Customer'},
      
      Welcome to the House of KOLZO. We're delighted to have you join our community of discerning individuals who appreciate timeless elegance.
      
      As a subscriber, you'll be the first to discover:
      • New collections and exclusive launches
      • Private event invitations
      • Personalized style recommendations
      • Early access to sales and promotions
      • VIP customer service
      
      To get started, explore our latest collection: https://kolzo.in
      
      Thank you for choosing KOLZO.
      
      Best regards,
      The KOLZO Team
      
      © 2024 KOLZO. All rights reserved.
    `
  }),

  // New Collection Launch
  newCollection: (collectionName: string, firstName?: string) => ({
    subject: `New Collection: ${collectionName} - KOLZO`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Collection: ${collectionName}</title>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f9f9f9;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            padding: 40px 20px;
          }
          .header { 
            text-align: center; 
            padding-bottom: 30px; 
            border-bottom: 1px solid #eee;
          }
          .logo { 
            font-size: 32px; 
            font-weight: 300; 
            letter-spacing: 0.2em; 
            color: #000; 
            margin-bottom: 10px;
          }
          .collection-title { 
            font-size: 24px; 
            font-weight: 300; 
            letter-spacing: 0.2em; 
            color: #000; 
            margin: 20px 0;
          }
          .cta-button { 
            display: inline-block; 
            background-color: #000; 
            color: #fff; 
            padding: 15px 30px; 
            text-decoration: none; 
            text-transform: uppercase; 
            letter-spacing: 0.2em; 
            font-weight: 300; 
            margin: 20px 0;
          }
          .footer { 
            text-align: center; 
            padding-top: 30px; 
            border-top: 1px solid #eee; 
            font-size: 12px; 
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">KOLZO</div>
          </div>
          
          <div style="text-align: center;">
            <div class="collection-title">${collectionName}</div>
            <p>Dear ${firstName || 'Valued Customer'},</p>
            <p>We're excited to announce our latest collection: ${collectionName}.</p>
            <p>As an exclusive subscriber, you have early access to this stunning new range.</p>
            
            <a href="https://kolzo.in/collections/${collectionName.toLowerCase().replace(/\s+/g, '-')}" class="cta-button">Shop the Collection</a>
            
            <p>Thank you for being part of the KOLZO family.</p>
          </div>
          
          <div class="footer">
            <p>© 2024 KOLZO. All rights reserved.</p>
            <p>You can <a href="#">unsubscribe</a> at any time.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
      New Collection: ${collectionName}
      
      Dear ${firstName || 'Valued Customer'},
      
      We're excited to announce our latest collection: ${collectionName}.
      
      As an exclusive subscriber, you have early access to this stunning new range.
      
      Shop the collection: https://kolzo.in/collections/${collectionName.toLowerCase().replace(/\s+/g, '-')}
      
      Thank you for being part of the KOLZO family.
      
      © 2024 KOLZO. All rights reserved.
    `
  }),

  // Sale Announcement
  saleAnnouncement: (saleName: string, discount: string, firstName?: string) => ({
    subject: `${saleName} - ${discount} Off - KOLZO`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${saleName} - ${discount} Off</title>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f9f9f9;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            padding: 40px 20px;
          }
          .header { 
            text-align: center; 
            padding-bottom: 30px; 
            border-bottom: 1px solid #eee;
          }
          .logo { 
            font-size: 32px; 
            font-weight: 300; 
            letter-spacing: 0.2em; 
            color: #000; 
            margin-bottom: 10px;
          }
          .sale-banner { 
            background-color: #000; 
            color: #fff; 
            padding: 20px; 
            text-align: center; 
            margin: 20px 0;
          }
          .discount { 
            font-size: 32px; 
            font-weight: 300; 
            letter-spacing: 0.2em;
          }
          .cta-button { 
            display: inline-block; 
            background-color: #000; 
            color: #fff; 
            padding: 15px 30px; 
            text-decoration: none; 
            text-transform: uppercase; 
            letter-spacing: 0.2em; 
            font-weight: 300; 
            margin: 20px 0;
          }
          .footer { 
            text-align: center; 
            padding-top: 30px; 
            border-top: 1px solid #eee; 
            font-size: 12px; 
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">KOLZO</div>
          </div>
          
          <div class="sale-banner">
            <div class="discount">${discount} OFF</div>
            <div>${saleName}</div>
          </div>
          
          <div style="text-align: center;">
            <p>Dear ${firstName || 'Valued Customer'},</p>
            <p>As an exclusive subscriber, you have early access to our ${saleName}.</p>
            <p>Don't miss out on these incredible savings.</p>
            
            <a href="https://kolzo.in/sale" class="cta-button">Shop the Sale</a>
            
            <p>Limited time only. Offer ends soon.</p>
          </div>
          
          <div class="footer">
            <p>© 2024 KOLZO. All rights reserved.</p>
            <p>You can <a href="#">unsubscribe</a> at any time.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
      ${saleName} - ${discount} Off
      
      Dear ${firstName || 'Valued Customer'},
      
      As an exclusive subscriber, you have early access to our ${saleName}.
      
      Don't miss out on these incredible savings.
      
      Shop the sale: https://kolzo.in/sale
      
      Limited time only. Offer ends soon.
      
      © 2024 KOLZO. All rights reserved.
    `
  }),

  // Event Invitation
  eventInvitation: (eventName: string, eventDate: string, firstName?: string) => ({
    subject: `You're Invited: ${eventName} - KOLZO`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You're Invited: ${eventName}</title>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f9f9f9;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            padding: 40px 20px;
          }
          .header { 
            text-align: center; 
            padding-bottom: 30px; 
            border-bottom: 1px solid #eee;
          }
          .logo { 
            font-size: 32px; 
            font-weight: 300; 
            letter-spacing: 0.2em; 
            color: #000; 
            margin-bottom: 10px;
          }
          .event-details { 
            background-color: #f8f8f8; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 5px;
            text-align: center;
          }
          .event-name { 
            font-size: 24px; 
            font-weight: 300; 
            letter-spacing: 0.2em; 
            color: #000; 
            margin-bottom: 10px;
          }
          .event-date { 
            font-size: 18px; 
            color: #666;
          }
          .cta-button { 
            display: inline-block; 
            background-color: #000; 
            color: #fff; 
            padding: 15px 30px; 
            text-decoration: none; 
            text-transform: uppercase; 
            letter-spacing: 0.2em; 
            font-weight: 300; 
            margin: 20px 0;
          }
          .footer { 
            text-align: center; 
            padding-top: 30px; 
            border-top: 1px solid #eee; 
            font-size: 12px; 
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">KOLZO</div>
          </div>
          
          <div style="text-align: center;">
            <p>Dear ${firstName || 'Valued Customer'},</p>
            <p>You're cordially invited to an exclusive KOLZO event.</p>
            
            <div class="event-details">
              <div class="event-name">${eventName}</div>
              <div class="event-date">${eventDate}</div>
            </div>
            
            <p>Join us for an evening of luxury, style, and exclusive access to our latest collection.</p>
            
            <a href="https://kolzo.in/events/${eventName.toLowerCase().replace(/\s+/g, '-')}" class="cta-button">RSVP Now</a>
            
            <p>We look forward to seeing you there.</p>
          </div>
          
          <div class="footer">
            <p>© 2024 KOLZO. All rights reserved.</p>
            <p>You can <a href="#">unsubscribe</a> at any time.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    textContent: `
      You're Invited: ${eventName}
      
      Dear ${firstName || 'Valued Customer'},
      
      You're cordially invited to an exclusive KOLZO event.
      
      ${eventName}
      ${eventDate}
      
      Join us for an evening of luxury, style, and exclusive access to our latest collection.
      
      RSVP: https://kolzo.in/events/${eventName.toLowerCase().replace(/\s+/g, '-')}
      
      We look forward to seeing you there.
      
      © 2024 KOLZO. All rights reserved.
    `
  })
}

export default emailTemplates 