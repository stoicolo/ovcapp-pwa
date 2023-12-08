<script setup>
import { ref } from "vue";
import { useToast } from "primevue/useToast";

defineProps({
  msg: String,
});

const count = ref(0);
const email = ref();
const toast = useToast();

const greet = () => {
  toast.add({
    severity: "info",
    summary: "Info",
    detail: email,
    life: 3000,
  });
};
</script>

<template>
  <div>
    <form
      @submit="onSubmit"
      class="is-flex is-flex-direction-row is-justify-content-center is-align-content-center"
    >
      <span class="p-float-label">
        <InputText
          id="email"
          v-model="email"
          type="email"
          :class="{ 'p-invalid': errorMessage }"
          aria-describedby="text-error"
          @keydown.enter="greet(email)"
        />
        <label for="email">Email</label>
      </span>
      <small class="p-error" id="text-error">{{
        errorMessage || "&nbsp;"
      }}</small>
      <Button class="ml-2" @click="greet" label="Email" />
    </form>
    <Toast />
  </div>
</template>

<style scoped></style>
