<template>
  <div>
    <v-sheet class="mx-auto mt-5" width="300">
      <v-form fast-fail @submit.prevent="submitForm">
        <v-text-field
          v-model="username"
          :rules="nameRules"
          label="Name"
        ></v-text-field>

        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
        ></v-text-field>

        <v-text-field
          v-model="confirmPassword"
          :rules="confirmPasswordRules"
          label="Confirm password"
        ></v-text-field>

        <v-btn :disabled="isDisabled" class="mt-2" type="submit" block
          >Submit</v-btn
        >
      </v-form>
    </v-sheet>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from '../../store/authStore';

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
      isDisabled: false,
      nameRules: [
        (value) => {
          if (value?.length >= 3 && value?.length <= 50) return true;

          return "Username must be between 3 and 50 characters!";
        },
      ],
      emailRules: [
        (value) => {
          const EMAIL_REGEXP =
            /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
          if (EMAIL_REGEXP.test(value)) return true;

          return "Invalid email!";
        },
      ],
      passwordRules: [
        (value) => {
          if (value?.length >= 8 && value?.length <= 16) return true;

          return "Password must be between 8 and 16 characters!";
        },
      ],
      confirmPasswordRules: [
        (value) => {
          this.isFormSucces();
          if (value == this.password) return true;

          return "Passwords must be match!";
        },
      ],
    };
  },
  mounted() {},
  methods: {
    submitForm() {
      const authStore = useAuthStore();
      const data = {
        username: this.username,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
      };
      console.log(this.isFormSucces());
      axios
        .post("http://localhost:8080/auth/register", data)
        .then((response) => {
          console.log("Успех:", response.data);
          authStore.isAuthenticated = true;
          this.$router.push("/notes");
        })
        .catch((error) => {
          console.error("Ошибка:", error);
          alert("Неверно введенные данные");
        });
    },
    isFormSucces() {
      const EMAIL_REGEXP =
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
      if (
        this.username.length >= 3 &&
        this.username.length <= 50 &&
        EMAIL_REGEXP.test(this.email) &&
        this.password.length >= 8 &&
        this.password.length <= 16 &&
        this.confirmPasswordRules.length >= 8 &&
        this.confirmPasswordRules.length <= 16
      ) {
        this.isDisabled = true;
        console.log(this.isDisabled);
      } else this.isDisabled = false;
    },
  },
};
</script>

<style scoped>
</style>