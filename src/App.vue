<template>
  <div id="app">
    <nav class="navbar sticky-top bg-body-tertiary" style="padding-bottom: 0px">
      <div class="container-fluid">
        <ul
          class="navbar-nav d-flex flex-row justify-content-evenly"
        >
          <li class="nav-item">
            <router-link to="/" class="nav-link">Домашняя</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <router-link to="/notes" class="nav-link">Заметки</router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link to="/register" class="nav-link"> Регистрация </router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link to="/login" class="nav-link"> Вход </router-link>
          </li>

          <li class="nav-item" v-if="isAuthenticated">
            <router-link to="/login" class="nav-link" @click.prevent="logOut"> Выход </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from './store/authStore';

export default {
  computed: {
    isAuthenticated() {
      const authStore = useAuthStore();
      return authStore.isAuthenticated;
    },
  },
  methods: {
    logOut() {
      const authStore = useAuthStore();
      axios.post("http://localhost:8080/auth/logout")
      .then((response) => {
          console.log("Успех:", response.data);
          authStore.isAuthenticated = false;
        })
        .catch((error) => {
          console.error("Ошибка:", error);
        });
      this.$router.push("/login");
    },
  },
  mounted(){
    const authStore = useAuthStore();
    authStore.checkSession();
  }
};
</script>

<style>
.container-fluid {
  display: inline !important;
  background: #ffffff;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-color: #f3f3f3;
  height: 50px;
}
</style>
