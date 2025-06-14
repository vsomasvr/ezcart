import api from '../axiosConfig';

const authService = {
  login: async (username, password) => {
    // Use Basic Auth for the login request
    const response = await api.get('/auth/user', {
      auth: {
        username,
        password,
      },
    });
    return response.data; // The backend should return the user object
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async () => {
    // This request relies on the session cookie being sent automatically
    const response = await api.get('/auth/user');
    return response.data;
  },
};

export default authService;