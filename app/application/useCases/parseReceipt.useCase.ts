import { Effect } from "effect";
import { ReceiptParserPort } from "../ports/receiptParser.port";
import type { ParseReceiptConfig } from "~/domain/ParseReceiptConfig.domain";

export const parseReceiptUC = (config: ParseReceiptConfig) =>
  Effect.gen(function* () {
    const receiptParser = yield* ReceiptParserPort;
    return yield* receiptParser.parseReceipt(config);
  });
