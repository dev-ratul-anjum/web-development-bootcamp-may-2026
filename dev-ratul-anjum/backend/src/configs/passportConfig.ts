import passport, { Profile } from "passport";
import axios from "axios";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Strategy as GitHubStrategy } from "passport-github2";
import { env } from "$/utils/env.js";
import { prisma } from "$/prisma/prisma.js";

// Fetch Email For Github
export const fetchPrimaryEmail = async (accessToken: string) => {
  try {
    const response = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer  ${accessToken}`,
        "User-Agent": "OAuth App",
      },
    });
    const primaryEmail = response.data.find(
      (emailObj: { email: string; primary: boolean; verified: boolean }) =>
        emailObj.primary && emailObj.verified,
    );
    return primaryEmail?.email;
  } catch (err) {
    return undefined;
  }
};

// Common callback function for OAuth providers
export const handleOAuthCallback = async (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  cb: VerifyCallback,
) => {
  try {
    const id = profile.id;
    const userProvider = profile.provider;
    let email = profile.emails?.[0]?.value ?? undefined;
    const name = profile.displayName ?? "No Name";
    const photo = profile.photos?.[0]?.value ?? undefined;
    const googleId = userProvider === "google" ? id : undefined;
    const twitterId = userProvider === "twitter" ? id : undefined;
    const githubId = userProvider === "github" ? id : undefined;

    if (userProvider === "github" && !email) {
      email = await fetchPrimaryEmail(accessToken);
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { googleId: id }, { twitterId: id }, { githubId: id }],
      },
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
      user = await prisma.user.create({
        data: {
          name,
          email,
          photo,
          googleId,
          twitterId,
          githubId,
        },
      });
    } else {
      const updateData: any = {};

      if (userProvider === "google" && !user.googleId) {
        updateData.googleId = id;
      }

      if (userProvider === "twitter" && !user.twitterId) {
        updateData.twitterId = id;
      }

      if (userProvider === "github" && !user.githubId) {
        updateData.githubId = id;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      }
    }

    cb(null, user);
  } catch (err) {
    console.error("OAuth callback error:", err);
    cb(err);
  }
};

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    handleOAuthCallback,
  ),
);

// Twitter Strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: env.TWITTER_CONSUMER_KEY,
      consumerSecret: env.TWITTER_CONSUMER_SECRET,
      callbackURL: env.TWITTER_CALLBACK_URL,
      includeEmail: true,
    },
    handleOAuthCallback,
  ),
);

// Github Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: env.GITHUB_CALLBACK_URL,
    },
    handleOAuthCallback,
  ),
);

// serializeUser:
// This runs once during login.
// It determines what data will be stored in the session.
// Best practice is to store only user.id,
// because storing the entire user object increases session size
// and can cause stale data issues.
passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

// deserializeUser:
// This runs on every request when a session is active.
// It receives whatever was stored during serialization (usually user.id).
// Using that id, we fetch the full user from the database
// and attach it to req.user.
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return done(null, false);

    done(null, user);
  } catch (err) {
    done(err);
  }
});
