import { Effect, pipe } from "effect";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { WorkbookXlsxAdapter } from "~documents/infra/adapters/workbookXlsx.adapter";
import { getColumnsFromXlsxFileUC } from "~documents/application/useCases/getColumnsFromXlsxFile.useCase";
import { FormFields } from "~documents/application/enums/FormFields.enum";

const FieldContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="flex flex-col gap-2 p-4 border-2 rounded-md min-w-96">
    {children}
  </div>
);

const FormatColumnsBadges = (
  formatColumns: (string | null)[]
): React.ReactNode => (
  <div className="flex flex-wrap gap-2">
    {formatColumns.map((column) => (
      <Badge key={column ?? "null"}>{column ?? "N/A"}</Badge>
    ))}
  </div>
);

const Home = () => {
  const [formatColumns, setFormatColumns] = useState<(string | null)[]>([]);

  function handleChangeFormatFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.item(0);

    if (!(file instanceof File)) return setFormatColumns([]);

    pipe(
      Effect.succeed(file),
      Effect.flatMap(getColumnsFromXlsxFileUC),
      Effect.tap(setFormatColumns),
      Effect.provide(WorkbookXlsxAdapter),
      Effect.runPromise
    );
  }

  return (
    <form
      method="post"
      encType="multipart/form-data"
      className="flex flex-col gap-2 items-center mt-4"
      action="/api/receipts"
    >
      <FieldContainer>
        <label htmlFor={FormFields.formatFile}>Selecciona la plantilla:</label>
        <Input
          type="file"
          id={FormFields.formatFile}
          name={FormFields.formatFile}
          accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          onChange={handleChangeFormatFile}
          required
        />
        <Input
          type="text"
          hidden
          readOnly
          name={FormFields.formatColumnsArrayString}
          value={JSON.stringify(formatColumns)}
        />
        {formatColumns.length > 0 && (
          <>
            <span>Columnas detectadas:</span>
            {FormatColumnsBadges(formatColumns)}
          </>
        )}
        <label htmlFor={FormFields.formatInstructions}>
          Instrucciones para el formato de salida:
        </label>
        <Textarea
          name={FormFields.formatInstructions}
          placeholder="Instrucciones para el formato de salida (opcional)"
          className="h-32"
        ></Textarea>
      </FieldContainer>
      <FieldContainer>
        <label htmlFor={FormFields.inputFiles}>Upload files:</label>
        <Input
          type="file"
          id={FormFields.inputFiles}
          name={FormFields.inputFiles}
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
          multiple
          required
        />
        <label htmlFor={FormFields.inputInstructions}>
          Additional Instructions:
        </label>
        <Textarea
          name={FormFields.inputInstructions}
          placeholder="Additional instructions (optional)"
          className="h-32"
        ></Textarea>
      </FieldContainer>
      <Button type="submit">Parse Receipts</Button>
    </form>
  );
};

export default Home;
