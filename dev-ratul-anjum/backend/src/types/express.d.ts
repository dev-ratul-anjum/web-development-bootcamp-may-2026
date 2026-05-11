import { User as PrismaUser } from "$/prisma/generated/client.ts";

declare global {
  namespace Express {
    interface User extends Pick<
      PrismaUser,
      "id" | "name" | "email" | "googleId" | "twitterId" | "githubId"
    > {}
  }
}
