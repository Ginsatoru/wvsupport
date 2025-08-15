import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/newsletter`;

// Subscribe to newsletter
export const subscribeToNewsletter = async (email) => {
  try {
    const response = await axios.post(API_URL, { email });
    
    // Check for warning about email sending failure
    if (response.data.warning) {
      console.warn(response.data.warning);
      // Still return success since subscription was recorded
      return response.data;
    }
    
    return response.data;
  } catch (error) {
    // Handle duplicate email case (409 Conflict)
    if (error.response?.status === 409) {
      // Return a success-like response for duplicate emails
      return {
        success: false,
        isDuplicate: true,
        message: error.response.data.message || 'Email is already subscribed'
      };
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Subscription failed';
    throw new Error(errorMessage);
  }
};

// Get all emails (admin only)
export const getAllNewsletterEmails = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to fetch emails';
    throw new Error(errorMessage);
  }
};