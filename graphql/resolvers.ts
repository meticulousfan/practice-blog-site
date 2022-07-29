export const resolvers = {
    Query: {
      Users: (_parent, _args, ctx) => {
        return ctx.prisma.user.findMany()
      }
      },
  }