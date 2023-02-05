import {
  CREATE_POST_ENDPOINT,
  DOWNVOTE_ENDPOINT,
  GET_POST_ANSWERS_IDS_ENDPOINT,
  GET_POST_ANSWER_ENDPOINT,
  GET_POST_ENDPOINT,
  GET_RELATED_POSTS,
  MARK_AS_ACCEPTED_ANSWER_ENDPOINT,
  UPVOTE_ENDPOINT,
  USER_GET_ALL_POSTS_OF_CURRENT_USER_ENDPOINT
} from '../constants/endpoints';
import { getUserToken } from '../utils/userAuth';
import instanceAxios from './base';

class PostAPI {
  static async all(verse, page = 0) {
    const token = getUserToken();
    if (!verse) {
      verse = 'hust';
    }
    const response = await instanceAxios.get(
      `${GET_POST_ENDPOINT}${verse}/?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async create(data) {
    const token = getUserToken();
    const response = await instanceAxios.post(
      CREATE_POST_ENDPOINT,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async show(verse, id) {
    const token = getUserToken();

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

  static async getPostAnswersIds(verse, id) {
    const token = getUserToken();

    const response = await instanceAxios.get(
      `${GET_POST_ANSWERS_IDS_ENDPOINT}${verse}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async getPostAnswer(verse, id) {
    const token = getUserToken();

    const response = await instanceAxios.get(
      `${GET_POST_ANSWER_ENDPOINT}${verse}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async getAllPostsOfCurrentUser(page = 1) {
    const token = getUserToken();

    const response = await instanceAxios.get(
      `${USER_GET_ALL_POSTS_OF_CURRENT_USER_ENDPOINT}?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  // static async show(id) {
  //   const token = getUserToken();
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
    const token = getUserToken();
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
    const token = getUserToken();
    const response = await instanceAxios.post(UPVOTE_ENDPOINT, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }

  static async downvote(data) {
    const token = getUserToken();
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

  static async markAsAcceptedAnswer(data) {
    const token = getUserToken();
    const response = await instanceAxios.post(
      MARK_AS_ACCEPTED_ANSWER_ENDPOINT,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }

  static async getRelatedPosts(id, verse) {
    const token = getUserToken();
    const response = await instanceAxios.get(
      `${GET_RELATED_POSTS}${id}`,
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
