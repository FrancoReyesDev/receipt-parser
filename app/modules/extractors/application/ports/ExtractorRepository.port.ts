import { Context, Effect } from "effect";
import type { ExtractorDomain } from "../../domain/Extractor.domain";
import type { NoSuchElementException } from "effect/Cause";

export class ExtractorRepositoryPort extends Context.Tag("ExtractorRepository")<
  ExtractorRepositoryPort,
  {
    getAll(): Effect.Effect<ExtractorDomain[], NoSuchElementException>;
    get(
      id: ExtractorDomain["id"]
    ): Effect.Effect<ExtractorDomain, NoSuchElementException>;
    put(extractor: ExtractorDomain): Effect.Effect<void>;
    delete(id: ExtractorDomain["id"]): Effect.Effect<void>;
  }
>() {}
