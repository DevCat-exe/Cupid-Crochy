import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role: "admin" | "staff" | "user";
}

export interface AuthSession extends Session {
  user: AuthUser;
}

export interface AuthToken extends JWT {
  id: string;
  role: "admin" | "staff" | "user";
}