import { Context, Effect } from "effect";
import type { OutputFormat } from "~/domain/OutputFormat.domain";

interface Parser {
  readonly parse: (params: {
    inputFiles: unknown[];
    outputFormat: OutputFormat;
    instructions?: string;
  }) => Effect.Effect<unknown>;
}

class ParserPort extends Context.Tag("ParserPort")<ParserPort, Parser>() {}
