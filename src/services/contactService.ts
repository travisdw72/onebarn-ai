import { apiClient } from '../utils/apiClient';
import { authConfig } from '../config/authConfig';

interface IContactFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  facilityName: string;
  numberOfHorses: string;
  inquiryType: string;
  subject: string;
  message: string;
}

interface IContactSubmissionResult {
  success: boolean;
  message: string;
  timestamp: string;
  ticketId?: string;
}

class ContactService {
  private readonly baseUrl = authConfig.production.enabled 
    ? authConfig.production.apiEndpoint 
    : 'http://localhost:3001';

  async submitContactForm(formData: IContactFormData): Promise<IContactSubmissionResult> {
    try {
      console.log('📧 Contact Form Submission:', {
        email: formData.email,
        inquiryType: formData.inquiryType,
        facilityName: formData.facilityName,
        timestamp: new Date().toISOString()
      });

      // Simulate API call delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await apiClient.post('/api/v1/contact/submit', {
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'contact-form',
        tenantId: authConfig.production.tenantId || 'public-inquiries'
      });

      if (response.data.success) {
        console.log('✅ Contact Form Submitted Successfully:', {
          email: formData.email,
          ticketId: response.data.ticketId,
          timestamp: new Date().toISOString()
        });

        return {
          success: true,
          message: 'Thank you for contacting us! We have received your message and will respond within 24 hours.',
          timestamp: new Date().toISOString(),
          ticketId: response.data.ticketId
        };
      } else {
        throw new Error(response.data.message || 'Failed to submit contact form');
      }
    } catch (error) {
      console.error('❌ Contact Form Submission Error:', {
        email: formData.email,
        error: error,
        timestamp: new Date().toISOString()
      });

      // If production API fails, simulate successful submission for demo
      if (!authConfig.production.enabled) {
        // Generate a mock ticket ID for demo purposes
        const mockTicketId = `DEMO-${Date.now().toString(36).toUpperCase()}`;
        
        // Log to localStorage for demo persistence
        this.logContactToLocalStorage(formData, mockTicketId);

        return {
          success: true,
          message: 'Thank you for contacting us! We have received your message and will respond within 24 hours.',
          timestamp: new Date().toISOString(),
          ticketId: mockTicketId
        };
      }

      return {
        success: false,
        message: 'There was an error submitting your message. Please try again or contact us directly at support@onebarnai.com.',
        timestamp: new Date().toISOString()
      };
    }
  }

  private logContactToLocalStorage(formData: IContactFormData, ticketId: string): void {
    try {
      const contactLog = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      const submission = {
        ...formData,
        ticketId,
        timestamp: new Date().toISOString(),
        status: 'submitted'
      };
      
      contactLog.push(submission);
      localStorage.setItem('contactSubmissions', JSON.stringify(contactLog));
      
      console.log('📝 Contact Form Logged to localStorage:', {
        ticketId,
        email: formData.email,
        total: contactLog.length
      });
    } catch (error) {
      console.error('Failed to log contact to localStorage:', error);
    }
  }

  async getContactHistory(): Promise<any[]> {
    try {
      const response = await apiClient.get('/api/v1/contact/history');
      return response.data.submissions || [];
    } catch (error) {
      // Fallback to localStorage for demo
      const contactLog = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      return contactLog;
    }
  }

  async validateEmail(email: string): Promise<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async validatePhone(phone: string): Promise<boolean> {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
  }
}

export const contactService = new ContactService();
export default contactService; 