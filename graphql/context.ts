// /graphql/context.ts
import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma";
import { verify } from "jsonwebtoken";

export type Context = {
  prisma: PrismaClient;
};
export async function createContext({ req, res }): Promise<Context> {
  const token = req.headers.authorization || "";
  let user: Object | null;
  if (token) {
    verify(token, "secret", (err, data) => {
      if (err) user = null;
      else user = data.data;
    });
  }
  return {
    prisma,
    //@ts-ignore
    user,
  };
}
