import { Context, Data, Effect, Option } from "effect";

export class AuthRepositoryError extends Data.TaggedError(
  "AuthRepositoryError"
)<{ cause: unknown }> {}

export class AuthRepositoryPort extends Context.Tag("AuthRepository")<
  AuthRepositoryPort,
  {
    getToken(): Effect.Effect<Option.Option<string>, AuthRepositoryError>;
    putToken(): Effect.Effect<void, AuthRepositoryError>;
    deleteToken(): Effect.Effect<void, AuthRepositoryError>;
  }
>() {}
