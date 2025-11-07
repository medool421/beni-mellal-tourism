import axios from 'axios';

const API_URL = 'https://690996b92d902d0651b45688.mockapi.io/api/attractions';

export const fetchAttractions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching attractions:', error);
    throw error;
  }
};