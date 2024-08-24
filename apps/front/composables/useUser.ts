interface User {
  id: string;
  email: string;
  password: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;

export const useUser = () => {
  const currentUser = useState<UserWithoutPassword | null>('user', () => null);
  const setUser = (user: any) => {
    currentUser.value = user;
  };

  const getCurrentUser = () => {
    return currentUser;
  }

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
    return currentUser;
  }

  const logout =  async () => {
    const data = await $fetch('/api/logout', {
      method: 'POST',
    });
    setUser(data.user);
  };

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
    getCurrentUser,
    login,
    logout,
    registerUser,
  }
};
