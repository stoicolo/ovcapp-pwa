<template>
  <div class="container">
    <Menubar :model="items" class="mt-5" />
    <PWAInstaller class="mt-5" />
    <Register-User class="mt-5" />
    <Service-Worker-Ref />
    <BulmaNavBar />
  </div>
</template>

<script setup>
import { ref } from "vue";

import RegisterUser from "./components/RegisterUser/RegisterUser.vue";
import ServiceWorkerRef from "./components/ServiceWorker/ServiceWorkerRef.vue";
import BulmaNavBar from "./components/NavBar/BulmaNavBar.vue";
import MenuBar from "./components/NavBar/BulmaNavBar.vue";
import PWAInstaller from "./components/PWAInstaller/PWAInstaller.vue";

const items = ref([
  {
    label: "Home",
    icon: "pi pi-home",
  },
  {
    label: "Features",
    icon: "pi pi-star",
  },
  {
    label: "Projects",
    icon: "pi pi-search",
    items: [
      {
        label: "Core",
        icon: "pi pi-bolt",
        shortcut: "⌘+S",
      },
      {
        label: "Blocks",
        icon: "pi pi-server",
        shortcut: "⌘+B",
      },
      {
        label: "UI Kit",
        icon: "pi pi-pencil",
        shortcut: "⌘+U",
      },
      {
        separator: true,
      },
      {
        label: "Templates",
        icon: "pi pi-palette",
        items: [
          {
            label: "Apollo",
            icon: "pi pi-palette",
            badge: 2,
          },
          {
            label: "Ultima",
            icon: "pi pi-palette",
            badge: 3,
          },
        ],
      },
    ],
  },
  {
    label: "Contact",
    icon: "pi pi-envelope",
    badge: 3,
  },
]);
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
