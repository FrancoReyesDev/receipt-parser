import { Context, Effect, Layer } from "effect";
import OpenAI from "openai";
import { ReceiptParserPort } from "~/application/ports/receiptParser.port";
import { systemPrompt } from "~/constants/Prompts";

export class OpenAIClient extends Context.Tag("OpenAIClient")<
  OpenAIClient,
  OpenAI
>() {}

export const receiptParserGPTAdapter = Layer.effect(
  ReceiptParserPort,
  Effect.gen(function* () {
    const client = yield* OpenAIClient;

    const parseReceipt = (
      format: { columnsArrayString: string; instructions: string },
      input: { file: File; instructions: string },
    ) =>
      Effect.gen(function* () {
        const fileContent = yield* Effect.promise(() =>
          fileToInputItem(input.file),
        );
        const response = yield* Effect.promise(() =>
          client.responses.create({
            model: "gpt-5",
            input: [
              {
                role: "system",
                content: systemPrompt,
              },

              {
                role: "user",
                content: [
                  {
                    type: "input_text",
                    text: `columnas del formato: ${format.columnsArrayString}, instrucciones adicionales para el formato: ${format.instructions ?? "sin instrucciones adicionales"}, instrucciones para el archivo: ${input.instructions}`,
                  },
                  fileContent as { type: "input_file" },
                ],
              },
            ],
            text: {
              format: { type: "json_object" },
            },
          }),
        );
        return response.output_text;
      });

    return { parseReceipt };
  }),
);
