import {
  ADMIN_LOG_IN_ENDPOINT,
  ADMIN_LOG_OUT_ENDPOINT,
  GET_ADMIN_ENDPOINT
} from '../constants/endpoints';
import { getAdminToken } from '../utils/adminAuth';
import instanceAxios from './base';

class AdminAuthAPI {
  static async getAdmin() {
    const token = getAdminToken();
    const response = await instanceAxios.get(GET_ADMIN_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }

  static async login(data) {
    const response = await instanceAxios.post(
      ADMIN_LOG_IN_ENDPOINT,
      data
    );
    return response.data;
  }

  static async logout() {
    const token = getAdminToken();
    const response = await instanceAxios.get(ADMIN_LOG_OUT_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
}

export default AdminAuthAPI;
