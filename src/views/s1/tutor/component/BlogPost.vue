<!-- BlogPost.vue -->
<script setup lang="ts">
defineProps<{
  title: string;
  bar?: number;
}>();
defineEmits(["enlargeText"]);
</script>

<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlargeText')">Enlarge text</button>
  </div>
</template>
