import { Context, Effect } from "effect";
import type { ParseReceiptConfigDTO } from "../dto/ParseReceiptConfig.dto";

export class ReceiptParserPort extends Context.Tag("ReceiptParser")<
  ReceiptParserPort,
  {
    parseReceipt: (
      config: ParseReceiptConfigDTO
    ) => Effect.Effect<(string | number)[][]>;
  }
>() {}
