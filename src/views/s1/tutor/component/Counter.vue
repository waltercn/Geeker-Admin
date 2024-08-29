<!-- Child.vue -->
<script setup>
const model = defineModel({ type: Number, default: 13 });

function update() {
  model.value++;
}
</script>

<template>
  <div>Parent bound v-model is: {{ model }}</div>
  <input v-model="model" />
  <button @click="update">Increment</button>
</template>
