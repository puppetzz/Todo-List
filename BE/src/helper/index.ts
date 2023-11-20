import { Payload } from "types/payload.type";
import jwt from "jsonwebtoken";
import { Strategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";

export const generateAccessToken = (payload: Payload): string => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: 60 * 60 });
};

export const generateRefreshToken = (payload: Payload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: 60 * 60 * 24 * 7 });
}

export const generateToken = (payload: Payload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { accessToken, refreshToken };
};

export const random = () => crypto.randomBytes(128).toString('base64');

export const hash = (salt: string, password:string) => {
  return crypto.createHmac('sha256', [salt, password].join('/')).update(process.env.SECRET).digest('hex');
}