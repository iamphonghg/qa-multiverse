/* eslint-disable no-unused-expressions */
const accessToken = 'access_token';
const intendedUrl = 'intendedUrl';
const defaultIntendedUrl = '/';

export const getToken = () =>
  window.localStorage.getItem(accessToken);

export const setToken = (token) => {
  token
    ? window.localStorage.setItem(accessToken, token)
    : window.localStorage.removeItem(accessToken);
};

export const getIntendedUrl = () =>
  window.localStorage.getItem(intendedUrl) || defaultIntendedUrl;

export const setIntendedUrl = (url) => {
  url
    ? window.localStorage.setItem(intendedUrl, url)
    : window.localStorage.removeItem(intendedUrl);
};
