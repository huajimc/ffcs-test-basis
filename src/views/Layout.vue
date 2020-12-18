<template>
  <task-layout>
    <router-view />
  </task-layout>
</template>

<script>
// @ is an alias to /src
import TaskLayout from "@/layouts/TaskLayout.vue";

export default {
  name: "index",
  components: { TaskLayout }
};
</script>
