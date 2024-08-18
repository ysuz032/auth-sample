<template>
  <h1 class="text-3xl font-bold mb-6">
    {{ title }}
  </h1>
</template>

<script lang="ts" setup>
defineProps<{ title: string }>();
</script>