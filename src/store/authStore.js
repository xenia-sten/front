import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    isAuthenticated: false,
  }),
  actions: {
    async checkSession() {
      try {
        const response = await axios.get('http://localhost:8080/auth/isAuthenticated');
        this.isAuthenticated = response.data.isAuthenticated;
      } catch (error) {
        console.error('Ошибка при проверке сессии:', error);
        this.isAuthenticated = false;
      }
    },
  },
});