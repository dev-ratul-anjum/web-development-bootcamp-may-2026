import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "./errorHandler.js";
import { env } from "$/utils/env.js";
import { prisma } from "$/prisma/prisma.js";

interface AuthPayload extends JwtPayload {
  userId: string;
}

const checkAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.signedCookies[env.ACCESS_TOKEN_NAME];

    if (!token) {
      throw new ApiError(401, "Please login to continue.");
    }

    let decodedUser: AuthPayload;
    try {
      decodedUser = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    } catch (error) {
      throw new ApiError(
        401,
        "Your session is invalid or has expired. Please login again.",
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decodedUser.userId },
      select: {
        id: true,
        name: true,
        email: true,
        googleId: true,
        twitterId: true,
        githubId: true,
      },
    });

    if (!user) {
      throw new ApiError(
        401,
        "Your session is invalid or has expired. Please login again.",
      );
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default checkAuth;
