import { USER_COMMENT_ENDPOINT } from '../constants/endpoints';
import { getUserToken } from '../utils/userAuth';
import instanceAxios from './base';

class CommentAPI {
  static async comment(data) {
    const token = getUserToken();
    const response = await instanceAxios.post(
      USER_COMMENT_ENDPOINT,
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

export default CommentAPI;
