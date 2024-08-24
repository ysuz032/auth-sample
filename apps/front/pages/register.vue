<!-- pages/register.vue -->
<template>
  <div class="flex flex-col items-center justify-center py-2">
    <PageTitle title="Register" />
    <form @submit.prevent="handleSubmit" class="w-full max-w-sm">
      <div class="mb-4">
        <label for="username" class="block text-gray-700 text-sm font-bold mb-2">Username:</label>
        <input id="username" v-model="form.data.username" type="text"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input id="email" v-model="form.data.email" type="email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password:</label>
        <input id="password" v-model="form.data.password" type="password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <p v-if="form.error"
        class="mb-3 px-3 py-1.5 w-full border rounded border-red-400 text-sm text-center text-red-400">
        {{ form.error }}
      </p>
      <div class="flex items-center justify-center">
        <button type="submit" :disabled="form.pending"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Register
        </button>
      </div>

    </form>
  </div>
</template>

<script lang="ts" setup>
const { registerUser } = useUser();

const form = reactive({
  data: {
    username: '',
    email: '',
    password: '',
  },
  error: '',
  pending: false,
});

const handleSubmit = async () => {
  try {
    form.error = '';
    form.pending = true;

    await registerUser(form.data.username, form.data.email, form.data.password);

    const redirect = '/';
    await navigateTo(redirect);
  } catch (error: any) {
    if (error.statusMessage) {
      form.error = error.statusMessage;
    } else {
      form.error = 'An unexpected error occurred.';
    }
  } finally {
    form.pending = false;
  }
};

</script>