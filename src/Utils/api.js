import axios from 'axios';

const getAuthenticatedAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export default getAuthenticatedAxios;