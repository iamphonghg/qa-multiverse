import {
  CREATE_POST_ENDPOINT,
  DOWNVOTE_ENDPOINT,
  GET_ALL_POST_ENDPOINT,
  GET_POST_ENDPOINT,
  UPVOTE_ENDPOINT
} from '../constants/endpoints';
import { getToken } from '../utils/auth';
import instanceAxios from './base';

class PostAPI {
  static async all(verse = 'hust', page = 0) {
    const token = getToken();
    const response = await instanceAxios.get(
      `${GET_ALL_POST_ENDPOINT}/${verse}/?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async create(values) {
    const token = getToken();
    const response = await instanceAxios.post(
      CREATE_POST_ENDPOINT,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async show(verse, id) {
    const token = getToken();

    const response = await instanceAxios.get(
      `${GET_POST_ENDPOINT}${verse}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  // static async show(id) {
  //   const token = getToken();
  //   const response = await instanceAxios.get(
  //     `${GET_POST_ENDPOINT}/${id}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     }
  //   );
  //   return response.data;
  // }

  static async test(formData) {
    const token = getToken();
    const response = await instanceAxios.post(
      'auth/test-upload',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async upvote(data) {
    const token = getToken();
    const response = await instanceAxios.post(UPVOTE_ENDPOINT, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }

  static async downvote(data) {
    const token = getToken();
    const response = await instanceAxios.post(
      DOWNVOTE_ENDPOINT,
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

export default PostAPI;
