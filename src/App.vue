<script setup>
import { ref } from "vue";
import RegisterUser from "./components/RegisterUser.vue";
import ServiceWorkerRef from "./ServiceWorkerRef.vue";
import PwaInstaller from "./components/pwaInstaller.vue";

const database = ref();
const todos = ref([]);
const newTodo = ref("");
const editedTodo = ref();
const visibility = ref("all");
</script>

<template>
  <div class="container">
    <PwaInstaller />
    <Register-User></Register-User>
    <Service-Worker-Ref />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
