import { Effect } from "effect";
import JSZip from "jszip";
import * as XLSX from "xlsx";
import path from "path";
import type { ParseReceiptConfigDTO } from "../dto/ParseReceiptConfig.dto";

interface Params extends Pick<ParseReceiptConfigDTO, "inputFile"> {
  inference: (string | number)[][];
  zip: JSZip;
}

export const zipWorbooksUC = ({ inputFile, inference, zip }: Params) =>
  Effect.gen(function* () {
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.aoa_to_sheet(inference);

    XLSX.utils.book_append_sheet(wb, ws, "factura");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    const fileName = path.parse(inputFile.name).name + ".xlsx";

    zip.file(fileName, buf);
  });
