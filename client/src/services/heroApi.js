// Hero Content API Service Functions
// Add these functions to your existing API service file

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Hero Content API Functions

// Get active hero content for frontend (public)
export const getActiveHeroContent = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/content/hero/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching active hero content:', error);
    throw error;
  }
};

// Get all hero content for admin
export const getAllHeroContent = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/content/hero/admin/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all hero content:', error);
    throw error;
  }
};

// Create new hero content
export const createHeroContent = async (heroData, imageFile) => {
  try {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!imageFile) {
      throw new Error('Background image is required');
    }

    // Create FormData for file upload
    const formData = new FormData();
    
    // Append hero data
    Object.keys(heroData).forEach(key => {
      if (heroData[key] !== null && heroData[key] !== undefined) {
        formData.append(key, heroData[key]);
      }
    });

    // Append image file
    formData.append('backgroundImage', imageFile);

    const response = await fetch(`${API_BASE_URL}/api/content/hero/admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating hero content:', error);
    throw error;
  }
};

// Update existing hero content
export const updateHeroContent = async (id, heroData, imageFile = null) => {
  try {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!id) {
      throw new Error('Hero ID is required');
    }

    // Create FormData for potential file upload
    const formData = new FormData();
    
    // Append hero data
    Object.keys(heroData).forEach(key => {
      if (heroData[key] !== null && heroData[key] !== undefined) {
        formData.append(key, heroData[key]);
      }
    });

    // Append image file if provided
    if (imageFile) {
      formData.append('backgroundImage', imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/api/content/hero/admin/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type header for FormData
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating hero content:', error);
    throw error;
  }
};

// Delete hero content
export const deleteHeroContent = async (id) => {
  try {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!id) {
      throw new Error('Hero ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/api/content/hero/admin/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting hero content:', error);
    throw error;
  }
};

// Toggle hero content active status
export const toggleHeroActive = async (id) => {
  try {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!id) {
      throw new Error('Hero ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/api/content/hero/admin/${id}/toggle-active`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error toggling hero active status:', error);
    throw error;
  }
};

// Test hero content endpoints
export const testHeroEndpoints = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/content/test`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error testing hero endpoints:', error);
    throw error;
  }
};