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
      console.log('Brevo: Adding contact with data:', contactData)
      
      const response = await this.client.post('/contacts', {
        email: contactData.email,
        attributes: {
          FIRSTNAME: contactData.firstName || '',
          LASTNAME: contactData.lastName || '',
          SOURCE: contactData.attributes?.source || 'website',
          SUBSCRIBED_AT: new Date().toISOString(),
          ...contactData.attributes
        },
        listIds: contactData.listIds || [parseInt(import.meta.env.VITE_BREVO_LIST_ID || '3')],
        updateEnabled: contactData.updateEnabled !== false
      })

      console.log('Brevo: Contact added successfully:', response.data)

      return {
        success: true,
        data: response.data,
        message: 'Contact added successfully',
        isNewSubscription: true
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
          message: 'Brevo API authentication failed - please check your API key'
        }
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Brevo API endpoint not found'
        }
      }
      
      return {
        success: false,
        message: `Failed to add contact to newsletter: ${error.message || 'Unknown error'}`
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
    console.log('Newsletter: Starting subscription for:', data.email)
    console.log('Newsletter: API Key available:', !!import.meta.env.VITE_BREVO_API_KEY)
    console.log('Newsletter: List ID:', import.meta.env.VITE_BREVO_LIST_ID)
    
    // Check if API key is available
    if (!import.meta.env.VITE_BREVO_API_KEY) {
      console.error('Newsletter: API key not found')
      return {
        success: false,
        message: 'Newsletter service not configured - please check API settings'
      }
    }

    // Check if contact already exists
    const existingContact = await brevoClient.checkContactExists(data.email)
    console.log('Newsletter: Existing contact check:', existingContact)
    
    if (existingContact.success && existingContact.exists) {
      return {
        success: false,
        message: 'This email is already registered for our newsletter',
        isAlreadyRegistered: true
      }
    }

    // Determine which list to use based on source
    const listId = data.listId || (data.source === 'chatbot' ? 3 : parseInt(import.meta.env.VITE_BREVO_LIST_ID || '3'))
    console.log('Newsletter: Using list ID:', listId)
    
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

    console.log('Newsletter: API response:', response)

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