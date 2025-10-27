import { Context, Effect } from "effect";
import * as XLSX from "xlsx";

export class WorkbookServicePort extends Context.Tag("WorkbookService")<
  WorkbookServicePort,
  {
    fileToWorkbook: (file: File) => Effect.Effect<XLSX.WorkBook>;
    getColumnsFromFormatWorkbook: (
      workbook: XLSX.WorkBook
    ) => Effect.Effect<(string | null)[]>;
  }
>() {}
