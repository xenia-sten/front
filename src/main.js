import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'
import router from "./router";
import axios from 'axios';
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
// import vuetify from './plugins/vuetify';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const app = createApp(App);

axios.defaults.withCredentials = true;
// axios.interceptors.request.use(config => {
//   // Извлеките CSRF токен из cookies.
//   const csrfToken = document.cookie
//     .split('; ')
//     .find(row => row.startsWith('XSRF-TOKEN='))
//     ?.split('=')[1]; // Это берёт значение токена

//   console.log('CSRF Token:', csrfToken);

//   if (csrfToken) {
//     // Установите заголовок X-XSRF-TOKEN.
//     config.headers['X-XSRF-TOKEN'] = csrfToken;
//     console.log('Заголовки запроса:', config.headers);
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

app.config.globalProperties.$axios = axios;

const pinia = createPinia();
const vuetify = createVuetify({
  components,
  directives,
})

app
  .use(pinia)
  .use(router)
  .use(vuetify, { iconfont: 'mdi' })
  .mount('#app')
