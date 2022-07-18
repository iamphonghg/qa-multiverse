import {
  GET_USER_ENDPOINT,
  LOG_IN_ENDPOINT,
  LOG_OUT_ENDPOINT,
  REGISTER_ENDPOINT
} from '../constants/endpoints';
import { getToken } from '../utils/auth';
import instanceAxios from './base';

class AuthAPI {
  static async getUser() {
    const token = getToken();
    const response = await instanceAxios.get(GET_USER_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data);
    return response.data;
  }

  static async login(data) {
    const response = await instanceAxios.post(LOG_IN_ENDPOINT, data);
    return response.data;
  }

  static async register(data) {
    const response = await instanceAxios.post(
      REGISTER_ENDPOINT,
      data
    );
    return response.data;
  }

  static async logout() {
    const token = getToken();
    const response = await instanceAxios.get(LOG_OUT_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
}

export default AuthAPI;
