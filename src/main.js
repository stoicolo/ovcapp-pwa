// main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import { registerSW } from "virtual:pwa-register";
import App from "./App.vue";

import PrimeVue from "primevue/config";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Toast from "primevue/toast";
import Menubar from "primevue/menubar";
import Card from "primevue/card";

import ToastService from "primevue/toastservice";

import "./registerServiceWorker";

import "./style.css";
import "primevue/resources/themes/lara-light-indigo/theme.css";
// import "primevue/resources/primevue.min.css";
import "primeflex/primeflex.min.css";

const app = createApp(App);
const pinia = createPinia();
const updateSW = registerSW({
  onNeedRefresh() {
    // Muestra algún UI para que el usuario pueda actualizar la aplicación
    console.log(
      "Nueva versión disponible! Haz clic en este mensaje para actualizar."
    );
  },
  onOfflineReady() {
    // Informa al usuario que la aplicación está lista para ser utilizada offline
    console.log("La aplicación está lista para funcionar offline!");
  },
});

app.use(PrimeVue, { unstyled: false });
app.use(ToastService);
app.component("InputText", InputText);
app.component("Button", Button);
app.component("Toast", Toast);
app.component("Menubar", Menubar);
app.component("Card", Card);

app.use(pinia);
app.mount("#app");
