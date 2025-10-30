import { Effect, Layer, pipe } from "effect";
import { ExtractorRepositoryPort } from "../../application/ports/ExtractorRepository.port";
import { AuthContextTag } from "~/modules/auth/application/tags/AuthContext.tag";
import { KVNamespaceTag } from "../tags/KVNamespace.tag";
import { kvSchema } from "~/modules/shared/infra/kvShema";
import type { ExtractorDomain } from "../../domain/Extractor.domain";

export const ExtractorKVRepositoryAdapter = Layer.effect(
  ExtractorRepositoryPort,
  Effect.gen(function* () {
    const kvNamespace = yield* KVNamespaceTag;
    const { orgId, userId } = yield* AuthContextTag;

    const get = (id: string) =>
      pipe(
        Effect.promise(() =>
          kvNamespace.get<ExtractorDomain>(
            kvSchema.extractor({ orgId, userId, id }),
            "json"
          )
        ),
        Effect.flatMap(Effect.fromNullable)
      );

    return {
      put: (extractor) =>
        Effect.promise(() =>
          kvNamespace.put(
            kvSchema.extractor({ orgId, userId, id: extractor.id }),
            JSON.stringify(extractor)
          )
        ),
      delete: (id) =>
        Effect.promise(() =>
          kvNamespace.delete(kvSchema.extractor({ orgId, userId, id }))
        ),
      get,
      getAll: () =>
        pipe(
          Effect.promise(() =>
            kvNamespace.list({
              prefix: kvSchema.extractor({ orgId, userId, id: "" }),
            })
          ),
          Effect.map((list) => list.keys.map((key) => get(key.name))),
          Effect.flatMap(Effect.all)
        ),
    };
  })
);
