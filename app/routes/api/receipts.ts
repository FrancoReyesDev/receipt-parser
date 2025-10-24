import { FormFields } from "~/constants/FormFields";
import type { Route } from "./+types/receipts";
import OpenAI from "openai";
import { Effect, Layer, pipe } from "effect";
import { parseReceiptUC } from "~/application/useCases/parseReceipt.useCase";
import {
  OpenAIClient,
  receiptParserGPTAdapter,
} from "~/infra/adapters/receiptParserGPT.adapter";
import JSZip from "jszip";
import { zipWorbooksUC } from "~/application/useCases/zipWorbooks.useCase";

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

  const client = new OpenAI({ apiKey: context.cloudflare.env.OPENAI_API_KEY });

  await Promise.all(
    inputFiles.map((file) =>
      pipe(
        Effect.succeed(file as File),
        Effect.flatMap((file) =>
          parseReceiptUC({
            formatColumns,
            formatInstructions,
            inputFile: file,
            inputInstructions,
          })
        ),
        Effect.tap((inference) =>
          zipWorbooksUC({ inputFile: file, inference, zip })
        ),
        Effect.provide(receiptParserGPTAdapter),
        Effect.provide(Layer.succeed(OpenAIClient, client)),
        Effect.runPromise
      )
    )
  );

  const zipBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  const filename = `facturas-${new Date().toISOString().slice(0, 10)}.zip`;

  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
