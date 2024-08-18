export const useRegister = () => {

  const registerUser = async (username: string, email: string, password: string) => {
    await $fetch('/api/register', {
      method: 'POST',
      body: {
        username: username,
        email: email,
        password: password,
      },
    });
  };

  return {
    registerUser,
  };
};