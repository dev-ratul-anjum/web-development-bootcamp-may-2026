import bcrypt from "bcryptjs";
import { ApiError } from "$/middlewares/errorHandler.js";
import { prisma } from "$/prisma/prisma.js";
import { TLoginUserSchema } from "./auth.schema.js";

const loginUser = async (data: TLoginUserSchema) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new ApiError(404, "No user found with the provided email.", "email");
  }

  if (!user.password) {
    throw new ApiError(
      401,
      "Incorrect password. Please try again.",
      "password",
    );
  }

  const isValid = await bcrypt.compare(data.password, user.password);

  if (!isValid) {
    throw new ApiError(
      401,
      "Incorrect password. Please try again.",
      "password",
    );
  }

  return user;
};

const authService = {
  loginUser,
};

export default authService;
