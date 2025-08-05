# Brevo Newsletter Integration Setup Guide

## Overview
This guide will help you set up Brevo (formerly Sendinblue) for your KOLZO newsletter functionality.

## Prerequisites
1. Brevo account (sign up at https://www.brevo.com/)
2. API key from Brevo dashboard
3. Contact list created in Brevo

## Step 1: Brevo Account Setup

### 1.1 Create Brevo Account
1. Go to https://www.brevo.com/
2. Sign up for a free account
3. Verify your email address

### 1.2 Get API Key
1. Log in to your Brevo dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create a new API key**
4. Give it a name (e.g., "KOLZO Newsletter")
5. Copy the API key (you'll only see it once)

### 1.3 Create Contact List
1. Go to **Contacts** → **Lists**
2. Click **Create a new list**
3. Name it "KOLZO Newsletter Subscribers"
4. Note the List ID (you'll need this)

## Step 2: Environment Configuration

### 2.1 Create Environment Variables
Create a `.env` file in your project root:

```env
# Brevo Configuration
VITE_BREVO_API_KEY=your_brevo_api_key_here
VITE_BREVO_LIST_ID=your_list_id_here

# API Configuration
VITE_API_URL=http://localhost:5000/api

# Other Configuration
VITE_APP_NAME=KOLZO
VITE_APP_URL=https://kolzo.in
```

### 2.2 Replace Placeholder Values
- Replace `your_brevo_api_key_here` with your actual Brevo API key
- Replace `your_list_id_here` with your Brevo list ID

## Step 3: Email Templates Setup

### 3.1 Create Email Templates in Brevo
1. Go to **Templates** → **Email Templates**
2. Create the following templates:

#### Welcome Email Template
- **Name**: KOLZO Welcome Email
- **Subject**: Welcome to KOLZO - Join the House
- **Content**: Use the HTML template from `src/utils/brevoTemplates.ts`

#### New Collection Template
- **Name**: KOLZO New Collection
- **Subject**: New Collection: {{collection_name}} - KOLZO
- **Content**: Use the new collection template

#### Sale Announcement Template
- **Name**: KOLZO Sale Announcement
- **Subject**: {{sale_name}} - {{discount}} Off - KOLZO
- **Content**: Use the sale announcement template

#### Event Invitation Template
- **Name**: KOLZO Event Invitation
- **Subject**: You're Invited: {{event_name}} - KOLZO
- **Content**: Use the event invitation template

### 3.2 Template Variables
Set up these variables in your Brevo templates:
- `{{firstName}}` - Subscriber's first name
- `{{lastName}}` - Subscriber's last name
- `{{email}}` - Subscriber's email
- `{{collection_name}}` - Collection name
- `{{sale_name}}` - Sale name
- `{{discount}}` - Discount percentage
- `{{event_name}}` - Event name
- `{{event_date}}` - Event date

## Step 4: Testing the Integration

### 4.1 Test Newsletter Subscription
1. Start your development server
2. Go to the newsletter section on your homepage
3. Enter a test email address
4. Submit the form
5. Check your Brevo dashboard to see if the contact was added

### 4.2 Test Welcome Email
1. After subscribing, check your email for the welcome message
2. Verify the email template is working correctly

### 4.3 Test API Functions
You can test the Brevo integration using the browser console:

```javascript
// Test adding a contact
import { addToNewsletter } from './src/utils/brevo.js'
addToNewsletter({
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  source: 'test',
  consent: true
})

// Test sending welcome email
import { sendWelcomeEmail } from './src/utils/brevo.js'
sendWelcomeEmail('test@example.com', 'Test')
```

## Step 5: Advanced Configuration

### 5.1 Newsletter Popup Triggers
The integration includes several trigger types:

```jsx
// Exit intent popup
<NewsletterTrigger 
  triggerType="exit-intent" 
  source="homepage" 
/>

// Scroll-based popup
<NewsletterTrigger 
  triggerType="scroll" 
  scrollPercentage={70} 
  source="product" 
/>

// Time-delayed popup
<NewsletterTrigger 
  triggerType="time-delay" 
  delay={30000} 
  source="checkout" 
/>
```

### 5.2 Custom Email Templates
You can create custom email templates by modifying `src/utils/brevoTemplates.ts`:

```typescript
// Add a new template
export const customTemplate = (data: any) => ({
  subject: 'Custom Subject',
  htmlContent: `
    <html>
      <body>
        <h1>Custom Template</h1>
        <p>Hello ${data.firstName}!</p>
      </body>
    </html>
  `,
  textContent: `Custom Template\n\nHello ${data.firstName}!`
})
```

### 5.3 Analytics Integration
Track newsletter performance:

```typescript
// Get newsletter statistics
import { getNewsletterStats } from './src/utils/brevo.js'
const stats = await getNewsletterStats()
console.log('Newsletter stats:', stats)
```

## Step 6: Production Deployment

### 6.1 Environment Variables
Make sure to set the production environment variables:

```env
VITE_BREVO_API_KEY=your_production_brevo_api_key
VITE_BREVO_LIST_ID=your_production_list_id
```

### 6.2 Email Sender Configuration
1. Go to **Settings** → **Senders & IP**
2. Add your domain as a sender
3. Verify your domain with Brevo
4. Set up SPF and DKIM records

### 6.3 Compliance
1. Ensure GDPR compliance for EU subscribers
2. Add unsubscribe links to all emails
3. Include privacy policy links
4. Set up double opt-in if required

## Step 7: Monitoring and Analytics

### 7.1 Brevo Dashboard
Monitor your newsletter performance in the Brevo dashboard:
- **Contacts** → **Lists** - View subscriber count
- **Analytics** → **Email Campaigns** - Track email performance
- **Reports** → **Email Activity** - Monitor engagement

### 7.2 Key Metrics to Track
- Subscriber growth rate
- Email open rates
- Click-through rates
- Unsubscribe rates
- Bounce rates

## Troubleshooting

### Common Issues

#### 1. API Key Issues
**Problem**: "Brevo API authentication failed"
**Solution**: 
- Verify your API key is correct
- Check if the API key has the necessary permissions
- Ensure the API key is not expired

#### 2. List ID Issues
**Problem**: "Contact not added to list"
**Solution**:
- Verify the list ID is correct
- Check if the list exists in your Brevo account
- Ensure the list is active

#### 3. Email Template Issues
**Problem**: "Email not sent"
**Solution**:
- Check if the template exists in Brevo
- Verify template variables are correctly formatted
- Test the template in Brevo dashboard

#### 4. Environment Variables
**Problem**: "API key not found"
**Solution**:
- Ensure `.env` file is in the project root
- Restart your development server after adding environment variables
- Check that variable names start with `VITE_`

### Debug Mode
Enable debug mode to see detailed logs:

```typescript
// In src/utils/brevo.ts
const DEBUG_MODE = import.meta.env.VITE_DEBUG === 'true'

if (DEBUG_MODE) {
  console.log('Brevo API Request:', config)
  console.log('Brevo API Response:', response.data)
}
```

## Support

### Brevo Documentation
- [Brevo API Documentation](https://developers.brevo.com/)
- [Brevo Email Templates](https://help.brevo.com/hc/en-us/articles/209467645)
- [Brevo Contact Management](https://help.brevo.com/hc/en-us/articles/209467645)

### KOLZO Integration
For issues specific to the KOLZO integration:
1. Check the browser console for error messages
2. Verify environment variables are set correctly
3. Test the API endpoints using the test functions
4. Review the Brevo dashboard for contact status

## Next Steps

1. **A/B Testing**: Set up A/B tests for email subject lines and content
2. **Segmentation**: Create subscriber segments based on behavior
3. **Automation**: Set up automated email sequences
4. **Integration**: Connect with your CRM or e-commerce platform
5. **Analytics**: Implement advanced tracking and reporting

This setup will give you a fully functional newsletter system integrated with Brevo for your KOLZO luxury fashion platform. 