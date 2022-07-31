// /graphql/types/User.ts
import { argsToArgsConfig } from "graphql/type/definition";
import {
  enumType,
  objectType,
  extendType,
  nonNull,
  stringArg,
  arg,
} from "nexus";
import { Blog } from "./Blog";
import { Comment } from "./Comment";
import jwt from "jsonwebtoken";
import { AuthPayload, userProfilePayload } from "./AuthPayload";
import { encryptIt, decryptIt } from "../../utils/hash";

const isPasswordUnMatchedOrNoUser = (
  user: {
    password: string;
  },
  args: {
    password: string;
  }
): boolean => {
  return !user || (user && decryptIt(user.password) !== args.password);
};

export const User = objectType({
  name: "User",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("email");
    t.string("password");
    t.field("role", { type: Role });
    t.list.field("blogs", {
      type: Blog,
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.user
          .findUnique({
            where: {
              id: _parent.id,
            },
          })
          .blogs();
      },
    });
    t.list.field("comments", {
      type: Comment,
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.user
          .findUnique({
            where: {
              id: _parent.id,
            },
          })
          .comments();
      },
    });
  },
});

const Role = enumType({
  name: "Role",
  members: ["USER", "ADMIN"],
});

export const UsersQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("users", {
      type: "User",
      resolve(_parent, _args, ctx) {
        return ctx.prisma.user.findMany();
      },
    });
  },
});

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signUp", {
      type: AuthPayload,
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        let message: string = "";
        const user = await ctx.prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: encryptIt(args.password),
          },
        });
        const token = jwt.sign(
          {
            data: user,
          },
          "secret",
          { expiresIn: "24h" }
        );
        return {
          token,
          message,
          user,
        };
      },
    });
    t.nonNull.field("signIn", {
      type: AuthPayload,
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        let user = await ctx.prisma.user.findUnique({
          where: {
            email: args.email,
          },
        });
        let message = "";
        let token = "";
        if (isPasswordUnMatchedOrNoUser(user, args)) {
          message = "Incorrect email or password!";
          let user = null;
          return {
            token,
            message,
            user,
          };
        } else {
          token = jwt.sign(
            {
              data: user,
            },
            "secret",
            { expiresIn: "24h" }
          );
          return {
            token,
            message,
            user,
          };
        }
      },
    });
  },
});

export const GetUserProfileQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getProfileByToken", {
      type: "User",
      resolve(_parent, _args, ctx) {
        return ctx.prisma.user.findUnique({
          where: {
            email: ctx.user.email,
          },
        });
      },
    });
  },
});
