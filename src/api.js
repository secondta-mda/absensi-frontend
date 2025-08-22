import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api-absensi-mda.netlify.app/api'
});

export default API;
