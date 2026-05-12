import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import authService from "./auth.service.js";
import {
  clearAuthCookie,
  createJwtToken,
  setAuthCookie,
} from "$/utils/authHelpers.js";
import { prisma } from "$/prisma/index.js";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.loginUser(req.body);

  const token = createJwtToken(user.id);
  setAuthCookie(res, token);

  responseHandler(res, 200, {
    success: true,
    message: "Login successfull.",
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  clearAuthCookie(res);

  responseHandler(res, 200, {
    success: true,
    message: "Logout successfull.",
  });
});

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user?.id,
    },
    select: {
      name: true,
      email: true,
      photo: true,
      bio: true,
    },
  });

  responseHandler(res, 200, {
    success: true,
    message: "User info retrive successfull.",
    data: user,
  });
});

const authController = {
  loginUser,
  logoutUser,
  getCurrentUser,
};

export default authController;
