<script setup lang="ts">
const firstName = defineModel("firstName", { type: String });
const lastName = defineModel("lastName", { type: String });
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
