import { FormFields } from "~/constants/FormFields";
import type { Route } from "./+types/receipts";
import OpenAI from "openai";
import { Effect, Layer, pipe } from "effect";
import { parseReceiptUC } from "~/application/useCases/parseReceipt.useCase";
import {
  OpenAIClient,
  receiptParserGPTAdapter,
} from "~/infra/adapters/receiptParserGPT.adapter";

export async function action({ context, request }: Route.ActionArgs) {
  const formData = await request.formData();

  const formatColumnsArrayString =
    (formData.get(FormFields.formatColumnsArrayString) as string) ?? "[]";
  const formatInstructions =
    (formData.get(FormFields.formatInstructions) as string) ?? "";

  const inputFiles = formData.getAll(FormFields.inputFiles);
  const inputInstructions =
    (formData.get(FormFields.inputInstructions) as string) ?? "";

  const client = new OpenAI({ apiKey: context.cloudflare.env.OPENAI_API_KEY });

  const openAiclientLive = Layer.succeed(OpenAIClient, client);

  const responses = await Promise.all(
    inputFiles.map((file) =>
      pipe(
        Effect.succeed(file as File),
        Effect.flatMap((file) =>
          parseReceiptUC(
            formatColumnsArrayString,
            formatInstructions,
            file,
            inputInstructions,
          ),
        ),
        Effect.provide(receiptParserGPTAdapter),
        Effect.provide(openAiclientLive),
        Effect.runPromise,
      ),
    ),
  );

  return new Response(String(responses), {
    status: formatColumnsArrayString === null || !inputFiles.length ? 400 : 200,
  });
}
