import axios from "axios";

// Use consistent environment variable
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/team`;

// Create instance for regular requests
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create instance for file uploads - DO NOT set Content-Type header
const apiFormData = axios.create({
  baseURL: API_URL,
  // Let browser set Content-Type with boundary for multipart/form-data
});

// Team Members API
export const getTeamMembers = () => api.get("/");

export const deleteTeamMember = (id) => api.delete(`/${id}`);

// File upload functions - let axios handle headers automatically
export const addTeamMember = (formData) => {
  return axios.post(API_URL, formData);
};

export const updateTeamMember = (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData);
};

// Contact Messages API

// Get all contact messages (for admin)
export const getContactMessages = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(`${API_BASE_URL}/api/contact/admin/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    throw error;
  }
};

// Reply to a contact message (updated to handle both string and object)
export const replyToContactMessage = async (messageId, replyData) => {
  try {
    const token = localStorage.getItem("adminToken");

    // The ReplyModal now makes the API call directly and returns the updated message
    // So this function shouldn't be called anymore, but keeping for backward compatibility
    console.warn(
      "replyToContactMessage API function called - this should not happen with the new ReplyModal"
    );

    // Handle both old format (string) and new format (object with attachments)
    let requestBody;
    let headers = {
      Authorization: `Bearer ${token}`,
    };

    if (typeof replyData === "string") {
      // Old format - just a string message
      requestBody = JSON.stringify({ replyMessage: replyData });
      headers["Content-Type"] = "application/json";
    } else if (replyData && typeof replyData === "object") {
      // New format - object with message and potentially attachments
      if (replyData.attachments && replyData.attachments.length > 0) {
        // If there are attachments, use FormData
        const formData = new FormData();
        formData.append("replyMessage", replyData.message || "");

        // Add attachments to FormData
        replyData.attachments.forEach((attachment) => {
          if (attachment.file) {
            formData.append("attachments", attachment.file);
          }
        });

        requestBody = formData;
        // Don't set Content-Type for FormData - let browser set it with boundary
      } else {
        // No attachments, use JSON
        requestBody = JSON.stringify({
          replyMessage:
            replyData.message || replyData.replyMessage || replyData,
        });
        headers["Content-Type"] = "application/json";
      }
    } else {
      throw new Error("Invalid reply data format");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/contact/admin/messages/${messageId}/reply`,
      {
        method: "PATCH",
        headers: headers,
        body: requestBody,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}${
          errorText ? ` - ${errorText}` : ""
        }`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error replying to message:", error);
    throw error;
  }
};

// Mark message as read
export const markMessageAsRead = async (messageId) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(
      `${API_BASE_URL}/api/contact/admin/messages/${messageId}/read`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}${
          errorText ? ` - ${errorText}` : ""
        }`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};

// Delete a contact message
export const deleteContactMessage = async (messageId) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(
      `${API_BASE_URL}/api/contact/admin/messages/${messageId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}${
          errorText ? ` - ${errorText}` : ""
        }`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

// Toggle message starred status
export const toggleMessageStar = async (messageId, starred) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(
      `${API_BASE_URL}/api/contact/admin/messages/${messageId}/star`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ starred }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}${
          errorText ? ` - ${errorText}` : ""
        }`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error toggling message star:", error);
    throw error;
  }
};

// Close a message manually (NEW)
export const closeMessage = async (messageId) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(
      `${API_BASE_URL}/api/contact/admin/messages/${messageId}/close`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}${
          errorText ? ` - ${errorText}` : ""
        }`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error closing message:", error);
    throw error;
  }
};

// Reopen a closed message (NEW)
export const reopenMessage = async (messageId) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch(
      `${API_BASE_URL}/api/contact/admin/messages/${messageId}/reopen`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}${
          errorText ? ` - ${errorText}` : ""
        }`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error reopening message:", error);
    throw error;
  }
};

// Submit contact form (for public contact page)
export const submitContactForm = async (contactData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}${
          errorText ? ` - ${errorText}` : ""
        }`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
};
