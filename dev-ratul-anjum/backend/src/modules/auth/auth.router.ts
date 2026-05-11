import express from "express";
import validateSchema from "$/middlewares/validateSchema.js";
import { loginUserSchema } from "./auth.schema.js";
import authController from "./auth.controller.js";
import checkAuth from "$/middlewares/checkAuth.js";
import setupOAuthProviderRoutes from "$/utils/setupOAuthProviderRoutes.js";
import { env } from "$/utils/env.js";

const authRouter = express.Router();

// Login Any User
authRouter.post(
  "/v1/login",
  validateSchema(loginUserSchema),
  authController.loginUser,
);

// Logout Any User
authRouter.post("/v1/logout", checkAuth, authController.logoutUser);

// Get Current User
authRouter.get("/v1/me", checkAuth, authController.getCurrentUser);

// Google OAuth login and callback routes
setupOAuthProviderRoutes(
  authRouter,
  "google",
  false,
  env.FRONTEND_OAUTH_SUCCESS_REDIRECT_URL,
  ["openid", "profile", "email"],
);

// Twitter OAuth login and callback routes
setupOAuthProviderRoutes(
  authRouter,
  "twitter",
  true,
  env.FRONTEND_OAUTH_SUCCESS_REDIRECT_URL,
);

// Github OAuth login and callback routes
setupOAuthProviderRoutes(
  authRouter,
  "github",
  false,
  env.FRONTEND_OAUTH_SUCCESS_REDIRECT_URL,
  ["user:email"],
);

export default authRouter;
