const BASE_API_ENDPOINT = 'http://127.0.0.1:8000/api/';
const GET_USER_ENDPOINT = 'user/me';
const LOG_IN_ENDPOINT = 'user/login';
const LOG_OUT_ENDPOINT = 'user/logout';
const REGISTER_ENDPOINT = 'user/register';

const CREATE_POST_ENDPOINT = 'user/createPost';
const GET_POST_ENDPOINT = 'user/posts/';
const UPVOTE_ENDPOINT = 'user/upvote';
const DOWNVOTE_ENDPOINT = 'user/downvote';
const UPDATE_USER_INFO_ENDPOINT = 'user/updateUserInfo';

const GET_POST_ANSWERS_IDS_ENDPOINT = 'user/getPostAnswersIds/';
const GET_POST_ANSWER_ENDPOINT = 'user/getPostAnswer/';
const USER_COMMENT_ENDPOINT = 'user/comment';
const MARK_AS_ACCEPTED_ANSWER_ENDPOINT = 'user/markAsAcceptedAnswer';
const USER_GET_ALL_POSTS_OF_CURRENT_USER_ENDPOINT =
  'user/getAllPostsOfCurrentUser';

const USER_GET_USER_INFO_ENDPOINT = 'user/getUserInfo/';
const GET_RELATED_POSTS = 'user/getRelatedPosts/';

const UPLOADED_IMG_DIR_URL =
  'http://127.0.0.1:8000/uploaded_img/product/';

const GET_ADMIN_ENDPOINT = 'admin/me';
const ADMIN_LOG_IN_ENDPOINT = 'admin/login';
const ADMIN_LOG_OUT_ENDPOINT = 'admin/logout';
const GET_ALL_QUESTIONS_COUNT_ENDPOINT = 'admin/getAllQuestionsCount';
const GET_ALL_ANSWERS_COUNT_ENDPOINT = 'admin/getAllAnswersCount';
const GET_ALL_USERS_COUNT_ENDPOINT = 'admin/getAllUsersCount';
const POST_STATS_BY_MONTHS_IN_YEAR_ENDPOINT =
  'admin/postStatsByMonthInYear/';
const USER_STATS_BY_MONTHS_IN_YEAR_ENDPOINT =
  'admin/userStatsByMonthInYear/';
const POST_STATS_BY_UNIVERSITY_ENDPOINT =
  'admin/postStatsByUniversity';
const GET_ALL_USERS_ENDPOINT = 'admin/getAllUsers';
const ADMIN_UPDATE_USER_INFO_ENDPOINT = 'admin/updateUserInfo';
const TOGGLE_BLOCK_USER_ENDPOINT = 'admin/toggleBlockUser';

export {
  GET_USER_ENDPOINT,
  LOG_IN_ENDPOINT,
  BASE_API_ENDPOINT,
  LOG_OUT_ENDPOINT,
  REGISTER_ENDPOINT,
  CREATE_POST_ENDPOINT,
  UPLOADED_IMG_DIR_URL,
  GET_POST_ENDPOINT,
  UPVOTE_ENDPOINT,
  DOWNVOTE_ENDPOINT,
  GET_POST_ANSWERS_IDS_ENDPOINT,
  GET_POST_ANSWER_ENDPOINT,
  USER_COMMENT_ENDPOINT,
  MARK_AS_ACCEPTED_ANSWER_ENDPOINT,
  USER_GET_ALL_POSTS_OF_CURRENT_USER_ENDPOINT,
  USER_GET_USER_INFO_ENDPOINT,
  UPDATE_USER_INFO_ENDPOINT,
  GET_ADMIN_ENDPOINT,
  ADMIN_LOG_IN_ENDPOINT,
  ADMIN_LOG_OUT_ENDPOINT,
  GET_ALL_QUESTIONS_COUNT_ENDPOINT,
  GET_ALL_ANSWERS_COUNT_ENDPOINT,
  GET_ALL_USERS_COUNT_ENDPOINT,
  POST_STATS_BY_MONTHS_IN_YEAR_ENDPOINT,
  USER_STATS_BY_MONTHS_IN_YEAR_ENDPOINT,
  POST_STATS_BY_UNIVERSITY_ENDPOINT,
  GET_ALL_USERS_ENDPOINT,
  ADMIN_UPDATE_USER_INFO_ENDPOINT,
  TOGGLE_BLOCK_USER_ENDPOINT,
  GET_RELATED_POSTS
};
