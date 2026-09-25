import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/newsletter`;
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}` });

// Subscribe to newsletter — source: "landing_page" | "footer_signup" | "popup" | "contact_form"
export const subscribeToNewsletter = async (email, source) => {
  try {
    const response = await axios.post(API_URL, { email, source });
    if (response.data.warning) console.warn(response.data.warning); // subscription still recorded
    return response.data;
  } catch (error) {
    // Duplicate email (409) — return a success-like response
    if (error.response?.status === 409) {
      return {
        success: false,
        isDuplicate: true,
        message: error.response.data.message || 'Email is already subscribed'
      };
    }
    throw new Error(error.response?.data?.message || error.message || 'Subscription failed');
  }
};

// Get all emails (admin only)
export const getAllNewsletterEmails = async () => {
  try {
    const response = await axios.get(API_URL, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch emails');
  }
};

// Mark subscribers as seen (admin only) — pass ids, or nothing for all
export const markSubscribersSeen = async (ids) => {
  const response = await axios.patch(`${API_URL}/seen`, ids ? { ids } : {}, { headers: authHeader() });
  return response.data;
};