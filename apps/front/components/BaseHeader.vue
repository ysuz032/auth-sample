<template>
  <header class="bg-slate-900">
    <div class="p-3 mx-auto w-full max-w-4xl">
      <nav class="flex gap-3">
        <NuxtLink to="/" class="flex-col text-center">
          <span class="text-sm leading-none">Home</span>
        </NuxtLink>
        <div class="ml-auto flex items-center gap-3">
          <template v-if="currentUser">
            <button
              class="py-1.5 px-3 rounded bg-light-100 font-semibold text-sm hover:bg-light-700 transition-colors"
              :disabled="form.pending"
              @click="submitLogout"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="px-3 font-semibold">Login</NuxtLink>
          </template>
        </div>
      </nav>
    </div>
  </header>
</template>

<script lang="ts" setup>
const { getCurrentUser, logout } = useUser();
const currentUser = getCurrentUser();


const form = reactive({
  pending: false,
});

const submitLogout = async() => {
  try {
    form.pending = true;

    await logout();

    await navigateTo("/");
  } catch (error) {
    console.error(error);
  } finally {
    form.pending = false;
  }
}
</script>