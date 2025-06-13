import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Logs in the user using Basic Authentication.
 * @param username The user's username.
 * @param password The user's password.
 * @returns The username if login is successful.
 */
export const login = async (username, password) => {
  const response = await api.get('/auth/user', {
    auth: {
      username,
      password,
    },
  });
  return response.data;
};

/**
 * Logs out the current user.
 */
export const logout = async () => {
  await api.post('/auth/logout');
};

/**
 * Gets the currently authenticated user.
 * @returns The username if a user is authenticated, otherwise null.
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/user');
    return response.data || null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

const authService = {
  login,
  logout,
  getCurrentUser,
};

export default authService;
