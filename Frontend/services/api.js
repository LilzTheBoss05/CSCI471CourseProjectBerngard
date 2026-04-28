// src/services/api.js

const API_BASE_URL = '/api'; // Or your full backend URL if different

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Merge in any custom headers if needed
  };

  // If token exists, inject it into the Authorization header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  // Optional: Add global error handling here (e.g., redirect to login if 401)
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login'; 
  }

  return response;
};
