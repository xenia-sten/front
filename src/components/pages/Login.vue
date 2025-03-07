<template>
  <div class="d-flex flex-column align-items-center">
    <v-sheet class="mx-auto mt-5" width="300">
      <v-form fast-fail @submit.prevent="login()">
        <v-text-field v-model="email" label="Email" type="email"></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          type="password"
        ></v-text-field>

        <v-btn class="mt-2" type="submit" block :disabled="!isFormValid"
          >Submit</v-btn
        >
      </v-form>
    </v-sheet>
    <v-alert v-if="showAlert" type="error" dismissible @input="showAlert" class="alert-container">
      {{ alertMessage }}
    </v-alert>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      showAlert: false,
      alertMessage: "",
    };
  },
  computed: {
    isFormValid() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Регулярное выражение для проверки формата email
      return (
        this.email !== "" &&
        this.password !== "" &&
        emailPattern.test(this.email)
      );
    },
  },
  methods: {
    login() {
      const authStore = useAuthStore();
      const data = {
        email: this.email,
        password: this.password,
      };
      axios
        .post("http://localhost:8080/auth/login", data)
        .then(() => {
          authStore.isAuthenticated = true;
          this.$router.push("/notes");
        })
        .catch((error) => {
          if (error.response) {
            console.error("Response error:", error.response.data);
            this.alertMessage = error.response.data.error;
            this.showNotification();
          } else if (error.request) {
            console.error("Request error:", error.request);
          } else {
            console.error("Error:", error.message);
          }
        });
    },
    showNotification() {
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    },
  },
};
</script>

<style scoped>
.alert-container{
  position: fixed;
  bottom: 20px; /* Отступ от нижней части экрана */
  z-index: 1000;
}
</style>