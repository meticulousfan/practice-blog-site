import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma";
import { verify } from "jsonwebtoken";

export type Context = {
  prisma: PrismaClient;
  user?: {
    id?: number;
    email?: string;
    name?: string;
    role?: string;
  };
};
export async function createContext({ req, res }): Promise<Context> {
  const token = req.headers.authorization || "";
  let user: object | null;
  if (token) {
    verify(token, "secret", (err: any, data: any) => {
      if (err) user = null;
      else user = data.data;
    });
  }
  return {
    prisma,
    user,
  };
}
