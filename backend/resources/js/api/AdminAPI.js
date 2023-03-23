import {
  ADMIN_UPDATE_USER_INFO_ENDPOINT,
  DELETE_POST_ENDPOINT,
  GET_ALL_ANSWERS_COUNT_ENDPOINT,
  GET_ALL_POSTS_ENDPOINT,
  GET_ALL_QUESTIONS_COUNT_ENDPOINT,
  GET_ALL_USERS_COUNT_ENDPOINT,
  GET_ALL_USERS_ENDPOINT,
  POST_STATS_BY_MONTHS_IN_YEAR_ENDPOINT,
  POST_STATS_BY_UNIVERSITY_ENDPOINT,
  TOGGLE_BLOCK_USER_ENDPOINT,
  USER_STATS_BY_MONTHS_IN_YEAR_ENDPOINT
} from '../constants/endpoints';
import { getAdminToken } from '../utils/adminAuth';
import instanceAxios from './base';

class AdminAPI {
  static async allQuestionsCount() {
    const token = getAdminToken();
    const response = await instanceAxios.get(
      GET_ALL_QUESTIONS_COUNT_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async updatePost(data) {
    const token = getAdminToken();
    const response = await instanceAxios.post(
      'admin/updatePost',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async allAnswersCount() {
    const token = getAdminToken();
    const response = await instanceAxios.get(
      GET_ALL_ANSWERS_COUNT_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async allUsersCount() {
    const token = getAdminToken();
    const response = await instanceAxios.get(
      GET_ALL_USERS_COUNT_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async postStatsByMonthInYear(year) {
    const token = getAdminToken();
    const response = await instanceAxios.get(
      `${POST_STATS_BY_MONTHS_IN_YEAR_ENDPOINT}${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async userStatsByMonthInYear(year) {
    const token = getAdminToken();
    const response = await instanceAxios.get(
      `${USER_STATS_BY_MONTHS_IN_YEAR_ENDPOINT}${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async postStatsByUniversity() {
    const token = getAdminToken();
    const response = await instanceAxios.get(
      POST_STATS_BY_UNIVERSITY_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async getAllUsers(page, searchString, statusQuery) {
    const token = getAdminToken();
    const response = await instanceAxios.get(
      `${GET_ALL_USERS_ENDPOINT}?page=${page}&searchString=${searchString}&statusQuery=${statusQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async getAllPosts(page, searchString) {
    const token = getAdminToken();
    const response = await instanceAxios.get(
      `${GET_ALL_POSTS_ENDPOINT}?page=${page}&searchString=${searchString}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async updateUserInfo(data) {
    const token = getAdminToken();
    const response = await instanceAxios.post(
      ADMIN_UPDATE_USER_INFO_ENDPOINT,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async toggleBlockUser(data) {
    const token = getAdminToken();
    const response = await instanceAxios.post(
      TOGGLE_BLOCK_USER_ENDPOINT,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async deletePost(data) {
    const token = getAdminToken();
    const response = await instanceAxios.post(
      DELETE_POST_ENDPOINT,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async reviewReport(data) {
    const token = getAdminToken();
    const response = await instanceAxios.post(
      'admin/reviewReport',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async createNotification(data) {
    const token = getAdminToken();
    const response = await instanceAxios.post(
      'admin/createNotification',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async changePermisison(data) {
    const token = getAdminToken();
    const response = await instanceAxios.post(
      'admin/changePermisison',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async getNotifications(page = 1) {
    const token = getAdminToken();
    const response = await instanceAxios.get(
      `admin/getNotifications?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async getReports(page, type, status) {
    const token = getAdminToken();
    const response = await instanceAxios.get(
      `admin/getReports?page=${page}&type=${type}&status=${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  // static async toggleBlockUser(data) {
  //   const token = getAdminToken();
  //   const response = await instanceAxios.post(
  //     TOGGLE_BLOCK_USER_ENDPOINT,
  //     data,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     }
  //   );
  //   return response.data;
  // }
  // static async updateUserInfo(data) {
  //   const token = getAdminToken();
  //   const response = await instanceAxios.post(
  //     ADMIN_UPDATE_USER_INFO_ENDPOINT,
  //     data,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     }
  //   );
  //   return response.data;
  // }
  // static async getAllAds(page) {
  //   const token = getAdminToken();
  //   const response = await instanceAxios.get(
  //     `${GET_ALL_ADS_ENDPOINT}?page=${page}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     }
  //   );
  //   return response.data;
  // }
  // static async addAd(formData) {
  //   const token = getAdminToken();
  //   const response = await instanceAxios.post(
  //     ADD_AD_ENDPOINT,
  //     formData,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     }
  //   );
  //   return response.data;
  // }
  // static async toggleStatusAd(data) {
  //   const token = getAdminToken();
  //   const response = await instanceAxios.post(
  //     TOGGLE_STATUS_AD_ENDPOINT,
  //     data,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     }
  //   );
  //   return response.data;
  // }
}

export default AdminAPI;
