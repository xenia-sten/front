import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from './store/authStore';

import Register from "./components/pages/Register.vue";
import Login from "./components/pages/Login.vue";
import NotesPage from "./components/pages/NotesPage.vue";
import Home from "./components/pages/Home.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/notes",
    name: "notes",
    component: NotesPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({ path: '/login' }); // редирект на главную страницу
    } else {
      next(); // Продолжить переход
    }
  } else {
    next(); // Если маршрут не требует аутентификации, продолжить
  }
});

export default router;