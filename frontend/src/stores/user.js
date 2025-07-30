import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const isLoading = ref(false);

  // Computed properties
  const isLoggedIn = computed(() => !!user.value && !!token.value);
  const userEmail = computed(() => user.value?.email || '');

  // Set axios default authorization header
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  // Login function
  const login = async (email, password) => {
    isLoading.value = true;
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password
      });
      
      const { user: userData, token: userToken } = response.data;
      
      // Store token and user data
      token.value = userToken;
      user.value = userData;
      localStorage.setItem('token', userToken);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Signup function
  const signup = async (email, password) => {
    isLoading.value = true;
    try {
      const response = await axios.post('http://localhost:3000/api/signup', {
        email,
        password
      });
      
      const { user: userData, token: userToken } = response.data;
      
      // Store token and user data
      token.value = userToken;
      user.value = userData;
      localStorage.setItem('token', userToken);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Signup failed' 
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Logout function
  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Verify token on app start
  const verifyToken = async () => {
    if (!token.value) return false;
    
    try {
      const response = await axios.get('http://localhost:3000/api/verify-token');
      user.value = response.data.user;
      return true;
    } catch (error) {
      // Token is invalid, clear it
      logout();
      return false;
    }
  };

  return {
    user,
    token,
    isLoading,
    isLoggedIn,
    userEmail,
    login,
    signup,
    logout,
    verifyToken
  };
}); 