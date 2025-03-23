<template>
  <div class="d-flex flex-column align-items-center">
    <v-sheet class="mx-auto mt-5" width="300">
      <v-form fast-fail @submit.prevent="submitForm">
        <v-text-field
          v-model="user.username"
          :rules="nameRules"
          label="Имя"
        ></v-text-field>

        <v-text-field v-model="user.email" type="email" label="Email"></v-text-field>

        <v-text-field
          v-model="user.password"
          :rules="passwordRules"
          type="password"
          label="Пароль"
        ></v-text-field>

        <v-text-field
          v-model="user.confirmPassword"
          type="password"
          label="Повторить пароль"
        ></v-text-field>

        <v-btn class="mt-2" type="submit" block :disabled="!isFormValid && isDisable"
          >Отправить</v-btn
        >
      </v-form>
    </v-sheet>
    <my-dialog :canClose="false" v-model:show="visibleVerifyForm">
      <verify-email-form :user="this.user"/>
    </my-dialog>
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
import MyDialog from '../ui/MyDialog.vue';
import VerifyEmailForm from '../VerifyEmailForm.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Register",
  components: {MyDialog, VerifyEmailForm},
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      showAlert: false,
      alertMessage: "",
      isDisable: false,
      visibleVerifyForm: false,
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
        this.user.username.length >= 3 && this.user.username.length <= 30;
      const passwordLengthValid =
        this.user.password.length >= 6 && this.user.password.length <= 20;

      return (
        this.user.username !== "" &&
        this.user.email !== "" &&
        this.user.password !== "" &&
        this.user.confirmPassword !== "" &&
        emailPattern.test(this.user.email) &&
        usernameLengthValid &&
        passwordLengthValid
      );
    },
  },
  methods: {
    submitForm() {
      // const authStore = useAuthStore();
      this.isDisable = true;
      axios
        .post("http://localhost:8080/auth/register", this.user)
        .then((response) => {
          console.log("Успех:", response.data);
          // authStore.isAuthenticated = true;
          // this.$router.push("/notes");
          this.setVerifyEmailForm();
        })
        .catch((error) => {
          if (error.response) {
            this.isDisable = false;
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
    setVerifyEmailForm(){
      this.visibleVerifyForm = true;
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