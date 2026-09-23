// src/services/projectService.js
import axios from 'axios';

// const API_URL = 'https://3pcommunicationsserver.vercel.app/api/projects'; // Update with your actual backend URL
const API_URL = 'https://3pcommunicationsserver.vercel.app/api/projects'; // Update with your actual backend URL

// Get all projects
export const getAllProjects = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Add a new project
export const createProject = async (projectData) => {
  try {
    const response = await axios.post(API_URL, projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};
