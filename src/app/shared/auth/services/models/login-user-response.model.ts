export interface LoginUserResponse {
  accessToken: string;
  user: { id: number; email: string; password: string };
}
