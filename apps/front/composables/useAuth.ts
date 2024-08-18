import { useAuthUser } from './useAuthUser';

export const useAuth = () => {
  const authUser = useAuthUser();
  const setUser = (user: any) => {
    authUser.value = user;
  };

  const login = async (email: string, password: string) => {
    const data = await $fetch('/api/login', {
      method: 'POST',
      body: {
        email,
        password,
      },
    });
    if(data){
      setUser(data.user);
    }
    return authUser;
  }

  const logout =  async () => {
    const data = await $fetch('/api/logout', {
      method: 'POST',
    });
    setUser(data.user);
  };

  return {
    login,
    logout,
  }
}
