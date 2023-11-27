// main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import { registerSW } from "virtual:pwa-register";
import App from "./App.vue";

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

app.use(pinia);
app.mount("#app");
