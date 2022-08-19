import {
  UPDATE_USER_INFO_ENDPOINT,
  USER_GET_USER_INFO_ENDPOINT
} from '../constants/endpoints';
import { getUserToken } from '../utils/userAuth';
import instanceAxios from './base';

class UserAPI {
  static async getUserInfo(id) {
    const token = getUserToken();

    const response = await instanceAxios.get(
      `${USER_GET_USER_INFO_ENDPOINT}${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async updateUserInfo(data) {
    const token = getUserToken();
    const response = await instanceAxios.post(
      `${UPDATE_USER_INFO_ENDPOINT}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }
}

export default UserAPI;
