export const resolvers = {
  Query: {
    blogs: (_parent, _args, ctx) => {
      return ctx.prisma.blog.findMany();
    },
    Users: (_parent, _args, ctx) => {
      return ctx.prisma.user.findMany();
    },
    comments: (_parent, _args, ctx) => {
      return ctx.prisma.comment.findMany();
    },
  },
};
