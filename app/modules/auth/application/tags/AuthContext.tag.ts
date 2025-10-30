import { Context } from "effect";

export class AuthContextTag extends Context.Tag("AuthContext")<
  AuthContextTag,
  { orgId: string; userId: string }
>() {}
