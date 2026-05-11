import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import "../configs/passportConfig.js";
import { createJwtToken, setAuthCookie } from "./authHelpers.js";
import { getAuthErrorPageHtml } from "./htmlContent.js";
import { env } from "./env.js";

/**
 * Setup OAuth provider routes (TypeScript version)
 * @param router Express Router instance
 * @param provider OAuth provider name ('google', 'github', 'twitter', etc.)
 * @param successRedirectUrl URL to redirect to after successful login
 * @param scope OAuth scopes (array of strings or single string)
 */
const setupOAuthProviderRoutes = (
  router: Router,
  provider: string,
  session: boolean,
  successRedirectUrl: string,
  scope?: string | string[],
): void => {
  // OAuth initiation route
  router.get(`/v1/${provider}`, passport.authenticate(provider, { scope }));

  // OAuth callback route
  router.get(
    `/v1/${provider}/callback`,
    (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate(
        provider,
        { session },
        (err: any, user: any, info: any) => {
          // User cancelled the consent screen
          if (req.query.error === "access_denied") {
            const errorPageHtml = getAuthErrorPageHtml(
              "You cancelled the login process.",
              env.FRONTEND_LOGIN_URL,
            );
            return res.status(401).send(errorPageHtml);
          }

          // OAuth provider internal error
          if (err) {
            const errorPageHtml = getAuthErrorPageHtml(
              `There was an issue connecting to ${provider}. Please try again.`,
              env.FRONTEND_LOGIN_URL,
            );
            return res.status(500).send(errorPageHtml);
          }

          // User object undefined
          if (!user) {
            const errorPageHtml = getAuthErrorPageHtml(
              "Authentication failed. Please try again.",
              env.FRONTEND_LOGIN_URL,
            );
            return res.status(401).send(errorPageHtml);
          }

          // Success case: create JWT, set cookie, redirect
          const token = createJwtToken(user.id);
          setAuthCookie(res, token);

          return res.redirect(successRedirectUrl);
        },
      )(req, res, next);
    },
  );
};

export default setupOAuthProviderRoutes;
