<script setup>
import { ref } from "vue";
import RegisterUser from "./components/RegisterUser.vue";

const database = ref();
const todos = ref([]);
const newTodo = ref("");
const editedTodo = ref();
const visibility = ref("all");
</script>

<template>
  <div class="container">
    <Register-User></Register-User>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
