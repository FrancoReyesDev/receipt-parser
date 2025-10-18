import { Context, Effect } from "effect";

export class ReceiptParserPort extends Context.Tag("ReceiptParser")<
  ReceiptParserPort,
  {
    parseReceipt: (
      format: { columnsArrayString: string; instructions: string },
      input: { file: File; instructions: string },
    ) => Effect.Effect<unknown>;
  }
>() {}
