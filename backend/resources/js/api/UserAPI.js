import {
  UPDATE_USER_INFO_ENDPOINT,
  USER_GET_USER_INFO_ENDPOINT
} from '../constants/endpoints';
import { getUserToken } from '../utils/userAuth';
import instanceAxios from './base';

class UserAPI {
  static async getUserInfo(id, page = 1) {
    const token = getUserToken();

    const response = await instanceAxios.get(
      `${USER_GET_USER_INFO_ENDPOINT}${id}?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async getNotifications() {
    const token = getUserToken();

    const response = await instanceAxios.get(
      'user/getNotifications',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async updatePost(data) {
    const token = getUserToken();
    const response = await instanceAxios.post(
      'user/updatePost',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async reportPost(data) {
    const token = getUserToken();
    const response = await instanceAxios.post(
      'user/reportPost',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async reportUser(data) {
    const token = getUserToken();
    const response = await instanceAxios.post(
      'user/reportUser',
      data,
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

  static async toggleNewNoti() {
    const token = getUserToken();
    const response = await instanceAxios.post(
      'user/toggleNewNoti',
      null,
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
