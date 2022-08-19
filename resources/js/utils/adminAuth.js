/* eslint-disable no-unused-expressions */
const adminAccessToken = 'admin_access_token';
const adminIntendedUrl = 'adminIntendedUrl';
const defaultAdminIntendedUrl = '/admin';

export const getAdminToken = () =>
  window.localStorage.getItem(adminAccessToken);

export const setAdminToken = (token) => {
  token
    ? window.localStorage.setItem(adminAccessToken, token)
    : window.localStorage.removeItem(adminAccessToken);
};

export const removeAdminToken = () => {
  window.localStorage.removeItem(adminAccessToken);
};

export const getAdminIntendedUrl = () =>
  window.localStorage.getItem(adminIntendedUrl) ||
  defaultAdminIntendedUrl;

export const setAdminIntendedUrl = (url) => {
  url
    ? window.localStorage.setItem(adminIntendedUrl, url)
    : window.localStorage.removeItem(adminIntendedUrl);
};
