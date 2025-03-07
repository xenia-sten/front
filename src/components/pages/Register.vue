<template>
  <div class="d-flex flex-column align-items-center">
    <v-sheet class="mx-auto mt-5" width="300">
      <v-form fast-fail @submit.prevent="submitForm">
        <v-text-field
          v-model="username"
          :rules="nameRules"
          label="Имя"
        ></v-text-field>

        <v-text-field v-model="email" type="email" label="Email"></v-text-field>

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          type="password"
          label="Пароль"
        ></v-text-field>

        <v-text-field
          v-model="confirmPassword"
          type="password"
          label="Повторить пароль"
        ></v-text-field>

        <v-btn class="mt-2" type="submit" block :disabled="!isFormValid"
          >Отправить</v-btn
        >
      </v-form>
    </v-sheet>
    <v-alert
      v-if="showAlert"
      type="error"
      dismissible
      @input="showAlert"
      class="alert-container"
    >
      {{ alertMessage }}
    </v-alert>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Register",
  components: {},
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      showAlert: false,
      alertMessage: "",
      nameRules: [
        (value) => {
          if (value?.length >= 3 && value?.length <= 30) return true;
          return "Имя может быть от 3 до 30 символов!";
        },
      ],
      passwordRules: [
        (value) => {
          if (value?.length >= 6 && value?.length <= 20) return true;
          return "Пароль может быть от 6 до 20 символов!";
        },
      ],
    };
  },
  computed: {
    isFormValid() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameLengthValid =
        this.username.length >= 3 && this.username.length <= 30;
      const passwordLengthValid =
        this.password.length >= 6 && this.password.length <= 20;

      return (
        this.username !== "" &&
        this.email !== "" &&
        this.password !== "" &&
        this.confirmPassword !== "" &&
        emailPattern.test(this.email) &&
        usernameLengthValid &&
        passwordLengthValid
      );
    },
  },
  methods: {
    submitForm() {
      const authStore = useAuthStore();
      const data = {
        username: this.username,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
      };
      axios
        .post("http://localhost:8080/auth/register", data)
        .then((response) => {
          console.log("Успех:", response.data);
          authStore.isAuthenticated = true;
          this.$router.push("/notes");
        })
        .catch((error) => {
          if (error.response) {
            console.error("Response error:", error.response.data.errors[0]);
            this.alertMessage = error.response.data.errors[0];
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
.alert-container {
  position: fixed;
  bottom: 20px; /* Отступ от нижней части экрана */
  z-index: 1000;
}
</style>