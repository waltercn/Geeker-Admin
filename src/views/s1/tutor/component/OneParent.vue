<script setup lang="ts">
import { ref } from "vue";
import Child from "./OneChild.vue";
import BlogPost from "./BlogPost.vue";
import Counter from "./Counter.vue";
import UserName from "./UserName.vue";
const posts = ref([
  { id: 1, title: "My journey with Vue" },
  { id: 2, title: "Blogging with Vue" },
  { id: 3, title: "Why Vue is so fun" }
]);
const postFontSize = ref(1);
const count = ref(1);
const firstName = ref("Walter");
const lastName = ref("Huang");
</script>

<template>
  <div>
    <h2>Basic Component: Here is a child component!</h2>
    <Child />&nbsp;&nbsp; <Child />&nbsp;&nbsp;
    <Child />
    <br />
    <h2>defineProps demo</h2>
    <!-- <BlogPost title="My journey with Vue" /> -->
    <!-- <BlogPost title="Blogging with Vue" /> -->
    <BlogPost title="Why Vue is so fun" />
    <div :style="{ fontSize: postFontSize + 'em' }">
      <BlogPost v-for="post in posts" :key="post.id" :title="post.title" @enlarge-text="postFontSize += 0.1"></BlogPost>
    </div>
    <br />
    <h2>defineModel demo</h2>
    <Counter v-model="count" />
    <h2>Multiple defineModel demo</h2>
    <h3>{{ firstName }} {{ lastName }}</h3>
    <UserName v-model:first-name="firstName" v-model:last-name="lastName" />
  </div>
</template>
