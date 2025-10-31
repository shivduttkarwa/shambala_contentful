import axios from 'axios';

// Configure Strapi API base URL
const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get image URL
export const getStrapiImageUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${STRAPI_URL}${path}`;
};

// Fetch hero content
export const fetchHeroContent = async () => {
  try {
    const response = await api.get('/hero?populate=deep');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return null;
  }
};

// Fetch services
export const fetchServices = async () => {
  try {
    const response = await api.get('/services?populate=*');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

// Fetch menu items
export const fetchMenuItems = async () => {
  try {
    const response = await api.get('/menu-items');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

export default api;
