import axios from "axios";

const BLOG_URL = "http://localhost:5000/api/blogs";

export const getAllBlogs = () => {
  return axios.get(BLOG_URL);
};

export const getSingleBlog = (id) => {
  return axios.get(`${BLOG_URL}/${id}`);
};

export const createBlog = (blogData, token) => {
  return axios.post(BLOG_URL, blogData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateBlog = (id, blogData, token) => {
  return axios.put(`${BLOG_URL}/${id}`, blogData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteBlog = (id, token) => {
  return axios.delete(`${BLOG_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
