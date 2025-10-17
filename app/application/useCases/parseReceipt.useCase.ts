import { Effect } from "effect";
import { ReceiptParserPort } from "../ports/receiptParser.port";

export const parseReceiptUC = (
  columnsArrayString: string,
  columnsInstructions: string,
  receiptFile: File,
  receiptInstructions: string,
) =>
  Effect.gen(function* () {
    const receiptParser = yield* ReceiptParserPort;
    return yield* receiptParser.parseReceipt(
      { columnsArrayString, instructions: columnsInstructions },
      { file: receiptFile, instructions: receiptInstructions },
    );
  });
