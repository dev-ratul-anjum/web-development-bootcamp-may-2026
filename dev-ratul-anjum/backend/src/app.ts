import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler.js";
import corsOptions from "./utils/corsOptions.js";
import appRouter from "./router.js";
import { env } from "./utils/env.js";

const app = express();

// Trust proxy must be set before session middleware
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Session setup (short-lived, memory)
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax", // dev:lax
      maxAge: 5 * 60 * 1000, // 5 min
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser(env.COOKIE_SECRET));

app.use("/api", appRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
