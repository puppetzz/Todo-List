export type User = {
  _id: string;
  username: string;
  password: string;
  role: string;
  refreshToken: string;
  refreshTokenSalt: string;
  createAt: Date;
};