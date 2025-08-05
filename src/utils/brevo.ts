// Brevo (formerly Sendinblue) Integration for KOLZO Newsletter
import axios from 'axios'

// Brevo API Configuration
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY
const BREVO_API_URL = 'https://api.brevo.com/v3'

// Brevo API Client
class BrevoClient {
  private client: any

  constructor() {
    this.client = axios.create({
      baseURL: BREVO_API_URL,
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    })
  }

  // Check if contact already exists
  async checkContactExists(email: string) {
    try {
      const response = await this.client.get(`/contacts/${email}`)
      return {
        success: true,
        exists: true,
        data: response.data
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          success: true,
          exists: false,
          data: null
        }
      }
      
      console.error('Brevo API Error:', error.response?.data || error.message)
      return {
        success: false,
        exists: false,
        message: 'Failed to check contact status'
      }
    }
  }

  // Add contact to Brevo
  async addContact(contactData: {
    email: string
    firstName?: string
    lastName?: string
    attributes?: Record<string, any>
    listIds?: number[]
    updateEnabled?: boolean
  }) {
    try {
      // First, check if contact already exists
      const existingContact = await this.getContact(contactData.email)
      
      const response = await this.client.post('/contacts', {
        email: contactData.email,
        attributes: {
          FIRSTNAME: contactData.firstName || '',
          LASTNAME: contactData.lastName || '',
          SOURCE: contactData.attributes?.source || 'website',
          SUBSCRIBED_AT: new Date().toISOString(),
          ...contactData.attributes
        },
        listIds: contactData.listIds || [parseInt(import.meta.env.VITE_BREVO_LIST_ID || '1')],
        updateEnabled: contactData.updateEnabled !== false
      })

      // Determine if this is a new subscription or update
      const isNewSubscription = !existingContact.success

      return {
        success: true,
        data: response.data,
        message: isNewSubscription 
          ? 'Contact added successfully' 
          : 'Subscription updated successfully',
        isNewSubscription
      }
    } catch (error: any) {
      console.error('Brevo API Error:', error.response?.data || error.message)
      
      // Handle specific Brevo errors
      if (error.response?.status === 400) {
        return {
          success: false,
          message: 'Invalid email address or contact already exists'
        }
      }
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Brevo API authentication failed'
        }
      }
      
      return {
        success: false,
        message: 'Failed to add contact to newsletter'
      }
    }
  }

  // Remove contact from Brevo
  async removeContact(email: string) {
    try {
      await this.client.delete(`/contacts/${email}`)
      
      return {
        success: true,
        message: 'Contact removed successfully'
      }
    } catch (error: any) {
      console.error('Brevo API Error:', error.response?.data || error.message)
      
      return {
        success: false,
        message: 'Failed to remove contact from newsletter'
      }
    }
  }

  // Get contact information
  async getContact(email: string) {
    try {
      const response = await this.client.get(`/contacts/${email}`)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      console.error('Brevo API Error:', error.response?.data || error.message)
      
      return {
        success: false,
        message: 'Contact not found'
      }
    }
  }

  // Update contact attributes
  async updateContact(email: string, attributes: Record<string, any>) {
    try {
      const response = await this.client.put(`/contacts/${email}`, {
        attributes
      })
      
      return {
        success: true,
        data: response.data,
        message: 'Contact updated successfully'
      }
    } catch (error: any) {
      console.error('Brevo API Error:', error.response?.data || error.message)
      
      return {
        success: false,
        message: 'Failed to update contact'
      }
    }
  }

  // Get newsletter statistics
  async getNewsletterStats() {
    try {
      const response = await this.client.get('/contacts/lists')
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      console.error('Brevo API Error:', error.response?.data || error.message)
      
      return {
        success: false,
        message: 'Failed to get newsletter statistics'
      }
    }
  }

  // Send transactional email
  async sendTransactionalEmail(emailData: {
    to: string
    subject: string
    htmlContent: string
    textContent?: string
    templateId?: number
    params?: Record<string, any>
  }) {
    try {
      const response = await this.client.post('/smtp/email', {
        to: [{ email: emailData.to }],
        subject: emailData.subject,
        htmlContent: emailData.htmlContent,
        textContent: emailData.textContent,
        templateId: emailData.templateId,
        params: emailData.params
      })
      
      return {
        success: true,
        data: response.data,
        message: 'Email sent successfully'
      }
    } catch (error: any) {
      console.error('Brevo API Error:', error.response?.data || error.message)
      
      return {
        success: false,
        message: 'Failed to send email'
      }
    }
  }

  // Get email templates
  async getEmailTemplates() {
    try {
      const response = await this.client.get('/senders')
      
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      console.error('Brevo API Error:', error.response?.data || error.message)
      
      return {
        success: false,
        message: 'Failed to get email templates'
      }
    }
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Format contact data for Brevo
  formatContactData(data: {
    email: string
    firstName?: string
    lastName?: string
    source?: string
    consent?: boolean
  }) {
    return {
      email: data.email,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      attributes: {
        SOURCE: data.source || 'website',
        CONSENT: data.consent ? 'true' : 'false',
        SUBSCRIBED_AT: new Date().toISOString(),
        WEBSITE: 'kolzo.in',
        BRAND: 'KOLZO'
      }
    }
  }
}

// Create singleton instance
const brevoClient = new BrevoClient()

// Export functions for easy use
export const addToNewsletter = async (data: {
  email: string
  firstName?: string
  lastName?: string
  source?: string
  consent?: boolean
  listId?: number
}): Promise<{
  success: boolean
  message: string
  isNewSubscription?: boolean
  isAlreadyRegistered?: boolean
}> => {
  try {
    // Check if contact already exists
    const existingContact = await brevoClient.checkContactExists(data.email)
    
    if (existingContact.success && existingContact.exists) {
      return {
        success: false,
        message: 'This email is already registered for our newsletter',
        isAlreadyRegistered: true
      }
    }

    // Determine which list to use based on source
    const listId = data.listId || (data.source === 'chatbot' ? 2 : parseInt(import.meta.env.VITE_BREVO_LIST_ID || '1'))
    
    const response = await brevoClient.addContact({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      attributes: {
        source: data.source || 'website',
        consent: data.consent || true
      },
      listIds: [listId]
    })

    if (response.success) {
      return {
        success: true,
        message: 'Successfully subscribed to newsletter',
        isNewSubscription: true
      }
    } else {
      return {
        success: false,
        message: response.message || 'Failed to subscribe to newsletter'
      }
    }
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    return {
      success: false,
      message: error.message || 'Failed to subscribe to newsletter'
    }
  }
}

export const removeFromNewsletter = async (email: string) => {
  return await brevoClient.removeContact(email)
}

export const getNewsletterStats = async () => {
  return await brevoClient.getNewsletterStats()
}

export const sendWelcomeEmail = async (email: string, firstName?: string) => {
  const welcomeTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #000; text-align: center; font-weight: 300; letter-spacing: 0.2em;">
        Welcome to KOLZO
      </h1>
      <p style="color: #333; line-height: 1.6;">
        Dear ${firstName || 'Valued Customer'},
      </p>
      <p style="color: #333; line-height: 1.6;">
        Welcome to the House of KOLZO. We're delighted to have you join our community of discerning individuals who appreciate timeless elegance.
      </p>
      <p style="color: #333; line-height: 1.6;">
        As a subscriber, you'll be the first to discover:
      </p>
      <ul style="color: #333; line-height: 1.6;">
        <li>New collections and exclusive launches</li>
        <li>Private event invitations</li>
        <li>Personalized style recommendations</li>
        <li>Early access to sales and promotions</li>
      </ul>
      <p style="color: #333; line-height: 1.6;">
        Thank you for choosing KOLZO.
      </p>
      <p style="color: #333; line-height: 1.6;">
        Best regards,<br>
        The KOLZO Team
      </p>
    </div>
  `

  return await brevoClient.sendTransactionalEmail({
    to: email,
    subject: 'Welcome to KOLZO - Join the House',
    htmlContent: welcomeTemplate,
    textContent: `Welcome to KOLZO! We're excited to have you join our community.`
  })
}

export const checkIfRegistered = async (email: string) => {
  return await brevoClient.checkContactExists(email)
}

export const validateEmailFormat = (email: string): boolean => {
  return brevoClient.validateEmail(email)
}

export default brevoClient 