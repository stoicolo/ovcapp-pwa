<template>
  <div class="grid">
    <div class="col">
      <CardTitleContent>
        <template v-slot:title>Test 1</template>
        <template v-slot:content> 300k </template>
      </CardTitleContent>
    </div>
    <div class="col">
      <CardTitleContent>
        <template v-slot:title>Test 2</template>
        <template v-slot:content> 300k </template>
      </CardTitleContent>
    </div>
    <div class="col">
      <CardTitleContent>
        <template v-slot:title>Test 3</template>
        <template v-slot:content> 300k </template>
      </CardTitleContent>
    </div>
  </div>
</template>

<script setup>
import CardTitleContent from "../Card/CardTitleContent.vue";
</script>

<style lang="scss" scoped></style>
