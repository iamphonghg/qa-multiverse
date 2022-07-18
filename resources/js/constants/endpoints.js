const BASE_API_ENDPOINT = 'http://127.0.0.1:8000/api/';
const GET_USER_ENDPOINT = 'auth/me';
const LOG_IN_ENDPOINT = 'auth/login';
const LOG_OUT_ENDPOINT = 'auth/logout';
const REGISTER_ENDPOINT = 'auth/register';

const CREATE_POST_ENDPOINT = 'auth/create-post';
const GET_ALL_POST_ENDPOINT = 'posts';
const GET_POST_ENDPOINT = 'posts/';
const UPVOTE_ENDPOINT = 'auth/upvote';
const DOWNVOTE_ENDPOINT = 'auth/downvote';

const UPLOADED_IMG_DIR_URL =
  'http://127.0.0.1:8000/uploaded_img/product/';

export {
  GET_USER_ENDPOINT,
  LOG_IN_ENDPOINT,
  BASE_API_ENDPOINT,
  LOG_OUT_ENDPOINT,
  REGISTER_ENDPOINT,
  CREATE_POST_ENDPOINT,
  GET_ALL_POST_ENDPOINT,
  UPLOADED_IMG_DIR_URL,
  GET_POST_ENDPOINT,
  UPVOTE_ENDPOINT,
  DOWNVOTE_ENDPOINT
};
