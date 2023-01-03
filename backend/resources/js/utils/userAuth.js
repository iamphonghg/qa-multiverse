/* eslint-disable no-unused-expressions */
const userAccessToken = 'user_access_token';
const intendedUrl = 'intendedUrl';
const defaultIntendedUrl = '/';

export const getUserToken = () =>
  localStorage.getItem(userAccessToken);

export const setUserToken = (token) => {
  token
    ? localStorage.setItem(userAccessToken, token)
    : localStorage.removeItem(userAccessToken);
};

export const removeUserToken = () => {
  localStorage.removeItem(userAccessToken);
};

export const getIntendedUrl = () =>
  localStorage.getItem(intendedUrl) || defaultIntendedUrl;

export const setIntendedUrl = (url) => {
  url
    ? localStorage.setItem(intendedUrl, url)
    : localStorage.removeItem(intendedUrl);
};
