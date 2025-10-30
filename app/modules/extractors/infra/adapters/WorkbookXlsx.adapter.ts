import * as XLSX from "xlsx";
import { Effect, Layer, pipe } from "effect";
import { WorkbookServicePort } from "~extractors/application/ports/WorkbookService.port";

const fileToWorkbook = (file: File) =>
  pipe(
    Effect.promise(() => file.arrayBuffer()),
    Effect.map((ab) => XLSX.read(ab))
  );

const getColumnsFromFormatWorkbook = (workbook: XLSX.WorkBook) =>
  pipe(
    Effect.succeed(workbook),
    Effect.map((workbook) => workbook.Sheets[workbook.SheetNames[0]]),
    Effect.map((sheet) =>
      XLSX.utils.sheet_to_json<(string | null)[]>(sheet, {
        header: 1,
        defval: null,
      })
    ),
    Effect.map((aoa) => aoa[0])
  );

export const WorkbookXlsxAdapter = Layer.succeed(WorkbookServicePort, {
  fileToWorkbook,
  getColumnsFromFormatWorkbook,
});
