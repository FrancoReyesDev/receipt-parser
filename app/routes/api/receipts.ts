import type { Route } from "./+types/receipts";
import OpenAI from "openai";
import { Effect, Layer, pipe } from "effect";
import _ from "lodash";
import JSZip from "jszip";
import { FormFields } from "~extractors/application/enums/FormFields.enum";
import { zipWorbooksUC } from "~extractors/application/useCases/zipWorbooks.useCase";
import {
  OpenAIClient,
  ReceiptParserGPTAdapter,
} from "~/modules/extractors/infra/adapters/ReceiptParserGPT.adapter";
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

  const mapInference = (inference: Record<string, any>[]) =>
    Effect.gen(function* () {
      if (
        handleMap === "false" ||
        !indexKeyDB ||
        !indexKeyFormat ||
        !mapKeyDB ||
        !mapKeyFormat
      )
        return inference;

      const database = JSON.parse(databaseJson) as Record<string, any>[];
      const indexedDatabase = _.keyBy(database, indexKeyDB);

      return inference.map((row) => {
        const index = row[indexKeyFormat];
        if (!(index in indexedDatabase)) return row;

        const databaseRow = indexedDatabase[index];

        const finalRow = mapKeyDB.reduce((acc, keyDb, index) => {
          const keyFormat = mapKeyFormat[index];
          const databaseValue = databaseRow[keyDb];
          const newRow = { ...acc, [keyFormat]: databaseValue };

          return newRow;
        }, row);

        return finalRow;
      });
    });

  const inferenceEachEffect = pipe(
    ReceiptParserPort,
    Effect.flatMap((parser) =>
      Effect.forEach(inputFiles, (file) =>
        pipe(
          parser.parseReceipt({
            formatColumns,
            formatInstructions,
            inputFile: file,
            inputInstructions,
          }),
          Effect.flatMap(mapInference),
          Effect.tap((inference) =>
            zipWorbooksUC({ inputFile: file, inference, zip })
          )
        )
      )
    ),
    Effect.provide(ReceiptParserGPTAdapter),
    Effect.provide(Layer.succeed(OpenAIClient, client))
  );

  await Effect.runPromise(inferenceEachEffect);

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
