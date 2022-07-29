// /graphql/types/Comment.ts
import { objectType, extendType, nonNull, stringArg, intArg, arg } from "nexus";
import { User } from "./User";
export const Comment = objectType({
  name: "Comment",
  definition(t) {
    t.int("id");
    t.string("description");
    t.int("blogId");
    t.int("authorId");
    t.nonNull.field("author", {
      type: User,
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.comment
          .findUnique({
            where: {
              id: _parent.id,
            },
          })
          .author();
      },
    });
  },
});

export const CommentsQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("comments", {
      type: "Comment",
      resolve(_parent, _args, ctx) {
        return ctx.prisma.comment.findMany();
      },
    });
  },
});

export const CommentMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createComment", {
      type: "Comment",
      args: {
        blogId: nonNull(intArg()),
        description: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        const comment = await ctx.prisma.comment.create({
          data: {
            description: args.description,
            blogId: args.blogId,
            authorId: ctx.user.id,
          },
        });
        return comment;
      },
    });
  },
});
