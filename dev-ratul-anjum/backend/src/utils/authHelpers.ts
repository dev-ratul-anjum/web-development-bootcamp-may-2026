import { Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "./env.js";
import { toMilliseconds, toSeconds } from "./timeConverter.js";

export const createJwtToken = (userId: string) => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: toSeconds(env.ACCESS_TOKEN_EXPIRES_IN),
  });
};

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(env.ACCESS_TOKEN_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    signed: true,
    maxAge: toMilliseconds(env.ACCESS_TOKEN_EXPIRES_IN),
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie(env.ACCESS_TOKEN_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    signed: true,
  });
};
