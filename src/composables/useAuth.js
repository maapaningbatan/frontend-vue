import { ref } from 'vue';
import authApi from '@/api/auth.js';

export default function useAuth() {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function register(data) {
    loading.value = true;
    error.value = null;
    try {
      const response = await authApi.register(data);
      localStorage.setItem('token', response.data.token);
      user.value = response.data.user;
    } catch (err) {
      error.value = err.response?.data || err.message;
    } finally {
      loading.value = false;
    }
  }

  async function login(data) {
    loading.value = true;
    error.value = null;
    try {
      const response = await authApi.login(data);
      localStorage.setItem('token', response.data.token);
      user.value = response.data.user;
    } catch (err) {
      error.value = err.response?.data || err.message;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;
    error.value = null;
    try {
      await authApi.logout();
      localStorage.removeItem('token');
      user.value = null;
    } catch (err) {
      error.value = err.response?.data || err.message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() {
    loading.value = true;
    error.value = null;
    try {
      const response = await authApi.getUser();
      user.value = response.data;
    } catch (err) {
      user.value = null;
      error.value = err.response?.data || err.message;
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    fetchUser,
  };
}
