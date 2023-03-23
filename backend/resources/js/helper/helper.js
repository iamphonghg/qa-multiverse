export const getAvatarPath = (filename) => {
  if (filename) {
    return `http://127.0.0.1:8000/uploaded_img/avatar/${filename}`;
  }
  return '';
};

export const getImagePath = (filename) => {
  if (filename) {
    return `http://127.0.0.1:8000/uploaded_img/post_img/${filename}`;
  }
  return '';
};
