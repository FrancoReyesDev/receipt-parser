import { Context, Effect, Layer } from "effect";
import OpenAI from "openai";
import { ReceiptParserPort } from "~/application/ports/receiptParser.port";
import { createUserPrompt, systemPrompt } from "~/constants/Prompts";
import type { ParseReceiptConfig } from "~/domain/ParseReceiptConfig.domain";

export class OpenAIClient extends Context.Tag("OpenAIClient")<
  OpenAIClient,
  OpenAI
>() {}

export const receiptParserGPTAdapter = Layer.effect(
  ReceiptParserPort,
  Effect.gen(function* () {
    const client = yield* OpenAIClient;

    const parseReceipt = (config: ParseReceiptConfig) =>
      Effect.gen(function* () {
        const fileIsPdf = config.inputFile.type === "application/pdf";

        const fileResponse = yield* Effect.promise(() =>
          client.files.create({
            file: config.inputFile,
            purpose: fileIsPdf ? "user_data" : "vision",
          })
        );

        const responseUserInputContent: OpenAI.Responses.ResponseInput = [];

        const fileContent = fileIsPdf
          ? ({ type: "input_file", file_id: fileResponse.id } as const)
          : ({ type: "input_image", file_id: fileResponse.id } as const);

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
                    text: createUserPrompt(config),
                  },
                ],
              },
            ],
            text: {
              format: { type: "json_object" },
            },
          })
        );
        return response.output_text;
      });

    return { parseReceipt };
  })
);
