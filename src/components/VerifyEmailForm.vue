<template>
  <div>
    <v-card
      class="py-8 px-6 text-center mx-auto ma-4"
      elevation="12"
      max-width="400"
      width="100%"
    >
      <h3 class="text-h6 mb-4">Подтвердите свою электронную почту</h3>
      <div class="text-body-2">
        Мы отправили код подтверждения на адрес {{ user.email }} <br />
        Пожалуйста, проверьте свою электронную почту и вставьте код ниже.
      </div>
      <v-sheet color="surface">
        <v-otp-input v-model="verifyCode" variant="solo"></v-otp-input>
      </v-sheet>
      <v-btn
        class="my-4"
        color="blue"
        height="40"
        text="Подтвердить"
        variant="flat"
        width="70%"
        @click="sendCode"
        :disable="isDisableBtn"
      ></v-btn>
    </v-card>
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
import { useAuthStore } from "../store/authStore";
import axios from "axios";
export default {
  name: "VerifyEmailForm",
  props: {
    user: {
      type: Object,
    },
  },
  data() {
    return {
      verifyCode: "",
      isDisableBtn: false,
      showAlert: false,
      alertMessage: "",
    };
  },
  methods: {
    sendCode() {
      const authStore = useAuthStore();
      this.isDisableBtn = true;
      axios
        .post(
          `http://localhost:8080/auth/verify-email?code=${this.verifyCode}`,
          this.user
        )
        .then((response) => {
          console.log("Успех:", response.data);
          authStore.isAuthenticated = true;
          this.$router.push("/notes");
        })
        .catch((error) => {
          if (error.response) {
            this.isDisableBtn = false;
            this.alertMessage = error.response.data;
            this.showNotification();
            console.error("Response error:", error.response.data);
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