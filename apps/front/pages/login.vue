<!-- pages/login.vue -->
<template>
  <div class="flex flex-col items-center justify-center py-2">
    <PageTitle title="Login" />
    <form @submit.prevent="handleSubmit" class="w-full max-w-sm">
      <p v-if="form.error"
        class="mb-3 px-3 py-1.5 w-full border rounded border-red-400 text-sm text-center text-red-400">
        {{ form.error }}
      </p>
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input id="email" v-model="form.data.email" type="text"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password:</label>
        <input id="password" v-model="form.data.password" type="password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div class="mb-6 flex items-center justify-center">
        <PageLink to="/register">ユーザ登録はこちら</PageLink>
      </div>
      <div class="flex items-center justify-center">
        <button type="submit" :disabled="form.pending"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const { login } = useUser()

const form = reactive({
  data: {
    email: '',
    password: ''
  },
  error: '',
  pending: false,
});

const handleSubmit = async () => {
  try {
    form.error = '';
    form.pending = true;

    await login(email.value, password.value);

    const redirect = '/';
    await navigateTo(redirect);
  } catch (error: any) {
    console.error(error.data.statusMessage);
    if (error.data.statusMessage) form.error = error.data.statusMessage;
  } finally {
    form.pending = false;
  }
}

// ユーザ登録ページへの遷移
const navigateToRegister = async () => {
  const redirect = '/register';
  await navigateTo(redirect);
}
</script>