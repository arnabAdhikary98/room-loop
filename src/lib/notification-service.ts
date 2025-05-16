/**
 * Notification Service
 * 
 * This service handles sending notifications via email and SMS.
 * In a production environment, this would integrate with email services
 * like SendGrid, Mailchimp, or AWS SES, and SMS services like Twilio.
 * 
 * For this demo, we'll simulate sending notifications with detailed logs.
 */

// Types
interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

interface SMSOptions {
  to: string;
  message: string;
}

// Config (in a real app, these would be environment variables)
const config = {
  emailSender: 'notifications@roomloop.com',
  emailServiceEndpoint: 'https://api.email-service.com/send',
  smsServiceEndpoint: 'https://api.sms-service.com/send'
};

/**
 * Sends an email notification
 * @param options Email options including recipient, subject, and body
 * @returns Promise that resolves when the email is sent
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const { to, subject, body, from = config.emailSender } = options;
    
    // Validate email format
    if (!isValidEmail(to)) {
      console.error(`Invalid email format: ${to}`);
      return false;
    }
    
    // In a production app, we would call an email service API
    // For this demo, we'll log the email details and simulate a successful send
    
    console.log('\n===== EMAIL NOTIFICATION =====');
    console.log(`From: ${from}`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log('=== EMAIL SENT SUCCESSFULLY ===\n');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real Windows environment with a service, you'd use:
    /*
    const response = await fetch(config.emailServiceEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text: body,
        // Optional HTML version
        html: `<div>${body.replace(/\n/g, '<br>')}</div>`
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Email service error:', errorData);
      return false;
    }
    */
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

/**
 * Sends an SMS notification
 * @param options SMS options including recipient phone number and message
 * @returns Promise that resolves when the SMS is sent
 */
export const sendSMS = async (options: SMSOptions): Promise<boolean> => {
  try {
    const { to, message } = options;
    
    // Validate phone number format (basic validation)
    if (!isValidPhoneNumber(to)) {
      console.error(`Invalid phone number format: ${to}`);
      return false;
    }
    
    // In a production app, we would call an SMS service API
    // For this demo, we'll log the SMS details and simulate a successful send
    
    console.log('\n===== SMS NOTIFICATION =====');
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    console.log('=== SMS SENT SUCCESSFULLY ===\n');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real Windows environment with a service, you'd use:
    /*
    const response = await fetch(config.smsServiceEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        to,
        message
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('SMS service error:', errorData);
      return false;
    }
    */
    
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
};

// Utility functions for validation
const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPhoneNumber = (phone: string): boolean => {
  const regex = /^[0-9\+\-\(\)\s]{10,15}$/;
  return regex.test(phone);
};

// Utility function to detect notification type and send appropriate notification
export const sendNotification = async (
  contact: string, 
  subject: string, 
  message: string
): Promise<boolean> => {
  // Determine if contact is an email or phone number
  const isEmail = contact.includes('@');
  
  if (isEmail) {
    return sendEmail({
      to: contact,
      subject,
      body: message
    });
  } else {
    return sendSMS({
      to: contact,
      message
    });
  }
}; 