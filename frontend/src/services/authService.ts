import api from '../axiosConfig';

const authService = {
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/user');
      // If the user is not authenticated, the backend returns an empty object.
      // Check for a specific property (like 'name') to determine if the user is logged in.
      if (response.data && response.data.name) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },
};

export default authService;