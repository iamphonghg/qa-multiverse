import axios from 'axios';
import { BASE_API_ENDPOINT } from '../constants/endpoints';

const instanceAxios = axios.create({
  baseURL: `${BASE_API_ENDPOINT}`,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json'
  },
  cache: 'no-cache'
});

export default instanceAxios;
