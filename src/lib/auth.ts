import { SignJWT, jwtVerify, type JWTPayload } from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const TOKEN_EXPIRY = "7d";

export type TokenPayload = JWTPayload & {
  id: number;
  email: string;
  name: string;
  role: string;
};

/** Sign a JWT with the user payload */
export async function signToken(payload: Omit<TokenPayload, "iat" | "exp" | "iss">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("conexus")
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(secret);
}

/** Verify and decode a JWT - throws on invalid/expired */
export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, secret, { issuer: "conexus" });
  return payload as TokenPayload;
}

/** Cookie configuration for httpOnly auth token */
export const AUTH_COOKIE_NAME = "conexus-token";
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};
