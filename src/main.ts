import { createApp, type Component } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';
import components from '@/components/UI';
import i18n from './locales/locales.main';
import axios from 'axios';

export const backendApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_ENDPOINT,
  timeout: 5000,
  withCredentials: true,
});
export const banchoApi = axios.create({
  baseURL: import.meta.env.VITE_BANCHO_API,
  timeout: 5000,
});

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.use(pinia);

import { useUserStore } from '@/stores/user';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
const userStore = useUserStore();

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!userStore.isLoggedIn) {
        next({
          path: '/login',
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    } else {
      if (userStore.isLoggedIn) {
        next({
          path: '/home',
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    }
  },
);

app.use(router);
app.use(i18n);

components.forEach((element: Component) => {
  app.component(element.name!, element);
});

app.mount('#app');
