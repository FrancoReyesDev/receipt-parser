import { Effect, Layer, Option } from "effect";
import {
  AuthRepositoryError,
  AuthRepositoryPort,
} from "~providers/application/ports/AuthRepository.port";
import { GoogleServiceAccountConfig } from "../configs/GoogleServiceAccount.config";
import { google } from "googleapis";
import type { GoogleServiceAccountDTO } from "../dto/GoogleServiceAccount.dto";

export const GoogleAuthRepositoryAdapter = Layer.effect(
  AuthRepositoryPort,
  Effect.gen(function* () {
    const ServiceAccount = yield* GoogleServiceAccountConfig;

    return {
      getToken: () =>
        Effect.gen(function* () {
          const ServiceAccountJson = yield* Effect.try({
            try: () => JSON.parse(ServiceAccount) as GoogleServiceAccountDTO,
            catch: () =>
              new AuthRepositoryError({
                cause: "Service Account Is Not a Valid Json.",
              }),
          });
          const auth = yield* Effect.tryPromise({
            try: async () =>
              new google.auth.GoogleAuth({
                credentials: ServiceAccountJson,
                scopes: ["https://www.googleapis.com/auth/cloud-platform"],
              }),
            catch: (error) =>
              new AuthRepositoryError({
                cause:
                  error instanceof Error
                    ? error.message
                    : "Unknown Error on GoogleAuth",
              }),
          });

          const client = yield* Effect.tryPromise({
            try: async () => auth.getClient(),
            catch: (error) =>
              new AuthRepositoryError({
                cause:
                  error instanceof Error
                    ? error.message
                    : "Unknown Error on getClient.",
              }),
          });

          const accessToken = yield* Effect.tryPromise({
            try: async () => client.getAccessToken().then(({ token }) => token),
            catch: (error) =>
              new AuthRepositoryError({
                cause:
                  error instanceof Error
                    ? error.message
                    : "Unknown Error on getAccessToken.",
              }),
          }).pipe(Effect.map((token) => Option.fromNullable(token)));

          return accessToken;
        }),
      putToken: () => Effect.succeed(void 0),
      deleteToken: () => Effect.succeed(void 0),
    };
  })
);
