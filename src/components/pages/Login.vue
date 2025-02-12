<template>
  <div>
    <v-sheet class="mx-auto mt-5" width="300">
      <v-form fast-fail @submit.prevent="login()">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          type="email"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          type="password"
        ></v-text-field>

        <v-btn class="mt-2" type="submit" block>Submit</v-btn>
      </v-form>
    </v-sheet>
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
    };
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
            // Запрос был сделан, и сервер ответил кодом статуса, который выходит за пределы диапазона 2xx
            console.error("Response error:", error.response.data);
          } else if (error.request) {
            // Запрос был сформирован, но ответ не был получен
            console.error("Request error:", error.request);
          } else {
            // Произошла ошибка при настройке запроса
            console.error("Error:", error.message);
          }
        });
    },
  },
};
</script>

<style>
</style>