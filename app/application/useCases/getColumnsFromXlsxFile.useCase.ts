import { Effect, pipe } from "effect";
import { WorkbookServicePort } from "../ports/workbookService.port";

export const getColumnsFromXlsxFileUC = (file: File) =>
  Effect.gen(function* () {
    const workbookService = yield* WorkbookServicePort;

    const columns = yield* pipe(
      Effect.succeed(file),
      Effect.flatMap(workbookService.fileToWorkbook),
      Effect.flatMap(workbookService.getColumnsFromFormatWorkbook),
    );

    return columns;
  });
