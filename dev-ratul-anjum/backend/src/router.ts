import express from "express";
import authRouter from "./modules/auth/auth.router.js";
import userRouter from "./modules/user/user.router.js";
import conversationRouter from "./modules/conversation/conversation.router.js";
import messageRouter from "./modules/message/message.router.js";

const appRouter = express.Router();

// Health check route
appRouter.get("/health", (req, res) => {
  // Respond quickly with minimal work
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toLocaleTimeString(),
    message: "Backend is alive!",
  });
});

appRouter.use("/auth", authRouter);
appRouter.use("/user", userRouter);
appRouter.use("/conversation", conversationRouter);
appRouter.use("/message", messageRouter);

export default appRouter;
