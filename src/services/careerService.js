// src/services/careerService.js
import axios from 'axios';

const API_URL = 'https://3pcommunicationsserver.vercel.app/api/careers';

// Get all careers
export const getAllCareers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching careers:', error);
    throw error;
  }
};

// Create a new career
export const createCareer = async (careerData) => {
  try {
    const response = await axios.post(API_URL, careerData);
    return response.data;
  } catch (error) {
    console.error('Error creating career:', error);
    throw error;
  }
};

// Update a career
export const updateCareer = async (id, careerData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, careerData);
    return response.data;
  } catch (error) {
    console.error('Error updating career:', error);
    throw error;
  }
};

// Delete a career
export const deleteCareer = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting career:', error);
    throw error;
  }
};
