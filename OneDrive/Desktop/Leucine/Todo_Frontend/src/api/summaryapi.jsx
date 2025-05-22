import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const generateAndSendSummary = async () => {
  const response = await axios.post(`${API_URL}/summarize`);
  return response.data;
};
