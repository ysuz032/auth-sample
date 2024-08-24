<!-- pages/index.vue -->
<template>
  <div class="flex flex-col items-center justify-center py-2">
    <PageTitle title="Home" />
    <div v-if="currentUser" class="text-center">
      <p>ユーザ情報</p>
      <PageUser :user="currentUser" />
    </div>
    <div v-else class="text-center">
      <p class="text-xl">You are not logged in.</p>
      <PageLink to="/login" >Login</PageLink>
      <!-- <nuxt-link to="/login" class="text-blue-500 hover:underline">Login</nuxt-link> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
const { getCurrentUser } = useUser()
const currentUser = getCurrentUser();
</script>