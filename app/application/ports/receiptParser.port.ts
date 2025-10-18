import { Context, Effect } from "effect";
import type { ParseReceiptConfig } from "~/domain/ParseReceiptConfig.domain";

export class ReceiptParserPort extends Context.Tag("ReceiptParser")<
  ReceiptParserPort,
  {
    parseReceipt: (config: ParseReceiptConfig) => Effect.Effect<unknown>;
  }
>() {}
