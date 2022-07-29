import { objectType, extendType } from "nexus";
import { User } from "./User";

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("token");
    t.string("message");
    t.field("user", {
      type: User,
    });
  },
});

export const userProfilePayload = objectType({
  name: "userProfilePayload",
  definition(t) {
    t.string("error");
    t.field("user", {
      type: User,
    });
  },
});
