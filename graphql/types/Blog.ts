// /graphql/types/Link.ts
import { Comment } from "./Comment";
import {
  enumType,
  objectType,
  extendType,
  nonNull,
  stringArg,
  intArg,
} from "nexus";
import { User } from "./User";
export const Blog = objectType({
  name: "Blog",
  definition(t) {
    t.int("id");
    t.string("title");
    t.string("description");
    t.string("category");
    t.int("authorId");
    t.nonNull.field("author", {
      type: User,
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.blog
          .findUnique({
            where: {
              id: _parent.id,
            },
          })
          .author();
      },
    });
    t.list.field("comments", {
      type: Comment,
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.blog
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

export const BlogsQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("blogs", {
      type: "Blog",
      resolve(_parent, _args, ctx) {
        return ctx.prisma.blog.findMany({});
      },
    });
    t.nonNull.field("blog", {
      type: "Blog",
      args: {
        id: nonNull(intArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.blog.findFirst({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const BlogMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createBlog", {
      type: Blog,
      args: {
        title: nonNull(stringArg()),
        description: nonNull(stringArg()),
        category: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        const blog = await ctx.prisma.blog.create({
          data: {
            authorId: ctx.user.id,
            title: args.title,
            description: args.description,
            category: args.category,
          },
        });
        return blog;
      },
    });
    t.nonNull.field("editBlog", {
      type: Blog,
      args: {
        title: nonNull(stringArg()),
        description: nonNull(stringArg()),
        category: nonNull(stringArg()),
        id: nonNull(intArg()),
      },
      async resolve(_parent, args, ctx) {
        const blog = await ctx.prisma.blog.update({
          where: {
            id: args.id,
          },
          data: {
            authorId: ctx.user.id,
            title: args.title,
            description: args.description,
            category: args.category,
          },
        });
        return blog;
      },
    });
    t.nonNull.field("removeBlog", {
      type: Blog,
      args: {
        id: nonNull(intArg()),
      },
      async resolve(_parent, args, ctx) {
        const blog = await ctx.prisma.blog.delete({
          where: {
            id: args.id,
          },
        });
        return blog;
      },
    });
  },
});
