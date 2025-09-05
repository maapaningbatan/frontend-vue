import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import axios from 'axios'

import App from "./App.vue";
import router from "./router";

import Paginator from "primevue/paginator"; // ✅

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.component("Paginator", Paginator); // ✅ register globally

app.mount("#app");

axios.defaults.baseURL = 'http://localhost:8000/api'
const token = localStorage.getItem('auth_token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}