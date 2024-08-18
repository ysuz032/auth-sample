export interface UserResponse {
  status: number;
  message: string;
  data?: UserDetail;
}

export interface UserDetail {
  id: string;
  email: string;
  name: string;
  password: string;
}