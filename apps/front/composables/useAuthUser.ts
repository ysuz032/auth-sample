export interface User {
  id: string;
  email: string;
  password: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;

export const useAuthUser = () => {
  return useState<UserWithoutPassword | null>('user', () => null);
};
