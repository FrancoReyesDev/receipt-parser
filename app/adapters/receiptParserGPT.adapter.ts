import { Context, Effect, Layer } from "effect";
import OpenAI from "openai";
import { ReceiptParserPort } from "~/application/ports/receiptParser.port";
import { systemPrompt } from "~/constants/Prompts";

export const fileToInputItem = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // convertir a base64 en entorno web
  let binary = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  const base64 = btoa(binary);

  const mimeType = file.type || "application/octet-stream";
  const dataUrl = `data:${mimeType};base64,${base64}`;

  if (mimeType.startsWith("image/"))
    return { type: "input_image", image_url: dataUrl } as const;

  if (mimeType === "application/pdf")
    return { type: "input_file", file_url: dataUrl } as const;

  throw new Error(`Tipo de archivo no soportado: ${mimeType}`);
};

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
            // reasoning: { effort: "low" },
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
