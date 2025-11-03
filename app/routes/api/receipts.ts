import type { Route } from "./+types/receipts";
import OpenAI from "openai";
import { Effect, Layer, pipe } from "effect";

import JSZip from "jszip";
import { FormFields } from "~extractors/application/enums/FormFields.enum";
import { parseReceiptUC } from "~extractors/application/useCases/parseReceipt.useCase";
import { zipWorbooksUC } from "~extractors/application/useCases/zipWorbooks.useCase";
import { ReceiptParserGPTAdapter } from "~/modules/extractors/infra/adapters/ReceiptParserGPT.adapter";
import { OpenAIClient } from "~extractors/infra/clients/OpenAi.client";
import { ReceiptParserPort } from "~/modules/extractors/application/ports/ReceiptParser.port";

export async function action({ context, request }: Route.ActionArgs) {
  const zip = new JSZip();
  const formData = await request.formData();
  const formatColumns = formData.get(
    FormFields.formatColumnsArrayString
  ) as string;
  const formatInstructions = formData.get(
    FormFields.formatInstructions
  ) as string;
  const inputFiles = formData.getAll(FormFields.inputFiles) as File[];
  const inputInstructions = formData.get(
    FormFields.inputInstructions
  ) as string;

  const handleMap = formData.get(FormFields.handleMap) as "true" | "false";
  const databaseJson = formData.get(FormFields.databaseJson) as string;
  const indexKeyDB = formData.get(FormFields.indexKeyDB) as undefined | string;
  const indexKeyFormat = formData.get(FormFields.indexKeyFormat) as
    | undefined
    | string;
  const mapKeyDB = formData.getAll(FormFields.mapKeyDB) as undefined | string[];
  const mapKeyFormat = formData.getAll(FormFields.mapKeyFormat) as
    | undefined
    | string[];

  const client = new OpenAI({ apiKey: context.cloudflare.env.OPENAI_API_KEY });

  const OpenAiClientLive = Layer.succeed(OpenAIClient, client);
  const ReceiptParserLive = ReceiptParserGPTAdapter.pipe(
    Layer.provide(OpenAiClientLive)
  );

  const inferenceEachEffect = Effect.forEach(inputFiles, (file) =>
    pipe(
      parseReceiptUC({
        formatColumns,
        formatInstructions,
        inputFile: file,
        inputInstructions,
      }),
      Effect.tap((inference) =>
        zipWorbooksUC({ inputFile: file, inference, zip })
      )
    )
  ).pipe(Effect.provide(ReceiptParserLive));

  await inferenceEachEffect.pipe(Effect.runPromise);

  const zipBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  const filename = `output-${new Date().toISOString().slice(0, 10)}.zip`;

  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
