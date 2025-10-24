import { Effect } from "effect";
import { ReceiptParserPort } from "../ports/ReceiptParser.port";
import type { ParseReceiptConfigDTO } from "../dto/ParseReceiptConfig.dto";

export const parseReceiptUC = (config: ParseReceiptConfigDTO) =>
  Effect.gen(function* () {
    const receiptParser = yield* ReceiptParserPort;
    return yield* receiptParser.parseReceipt(config);
  });
