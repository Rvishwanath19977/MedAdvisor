// apiService.js
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/';

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    apiService.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    delete apiService.defaults.headers.common['Authorization'];
  }
};

export const login = async (username, password) => {
  try {
    const response = await apiService.post('/login/', { username, password });
    const token = response.data.token;
    setAuthToken(token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response.data;
  }
};


export const getUserDetails = async () => {
  try {
    const response = await apiService.get('/user-details/');
    return response.data;
  } catch (error) {
  }
};


export const createBlogPost = async (data) => {
    try {
      const response = await apiService.post('/create-blog-post/', data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export const fillPreMedicalForm = async (data) => {
    try {
      const response = await apiService.post('/fill-pre-medical-form/', data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export const getPatientSymptoms = async () => {
    try {
      const response = await apiService.get('/get-pre-medical-form/');
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export const getPatientBlogPosts = async () => {
    try {
      const response = await apiService.get('/api/blog-posts/');
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const replyToPreMedicalForm = async (formId) => {
    try {
      const response = await apiService.patch(`/reply-to-pre-medical-form/${formId}/`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export const createComment = async (data) => {
    try {
      const response = await apiService.post('/create-comment/', data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
export const getMessages = async () => {
  try {
    const response = await apiService.get('/get-messages/');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createMessage = async (data) => {
  try {
    const response = await apiService.post('/send-message/', data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getComments = async (blogPostId) => {
  try {
    const response = await apiService.get(`/get-comments/${blogPostId}/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}; 

export const getAdminComments = async (blogPostId) => {
  try {
    const response = await apiService.get(`/admin-get-comments/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin comments:', error);
    throw error;
  }
};

export const register = async (username, email, password, role) => {
  try {
    const response = await apiService.post('/register/', { username, email, password, role });
    const token = response.data.token;
    setAuthToken(token);
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error.response.data;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiService.get('/get-all-users/');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const promoteUser = async (userId) => {
  try {
    const response = await apiService.post(`/promote-user/${userId}/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const deleteUser = async (userId) => {
  try {
    const response = await apiService.delete(`/delete-user/${userId}/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteBlogPost = async (blogPostId) => {
  try {
    const response = await apiService.delete(`/delete-blogpost/${blogPostId}/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deletePreMedicalForm = async (formId) => {
  try {
    const response = await apiService.delete(`/delete-premedicalform/${formId}/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await apiService.delete(`/delete-comment/${commentId}/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

