import { AuthenticationError, AuthorizationError } from "./errors";

export const requireIdentity = async (ctx: { auth: { getUserIdentity: () => Promise<{ subject: string } | null> } }) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new AuthenticationError();
  }
  return identity;
};

export const hasRole = (user: { roles: string[] }, role: string) => {
  return user.roles.includes(role);
};

export const requireRole = (user: { roles: string[] }, role: string) => {
  if (!hasRole(user, role)) {
    throw new AuthorizationError(`Missing required role: ${role}`);
  }
};
