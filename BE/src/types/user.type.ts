export type User = {
  username: string;
  password: string;
  role: string;
  refreshToken: string;
  refreshTokenSalt: string;
  createAt: Date;
};