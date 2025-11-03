import { Effect, pipe } from "effect";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { FormFields } from "~extractors/application/enums/FormFields.enum";
import type { BreadcrumbHandle } from "~/components/root/app-breadcrumb";
import { Label } from "~/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "~/components/ui/native-select";
import { ArrowRight } from "lucide-react";
import { Switch } from "~/components/ui/switch";

export function xlsxToJson<T>(file: File): Effect.Effect<T[], Error> {
  return Effect.gen(function* () {
    const ab = yield* Effect.promise(() => file.arrayBuffer());
    const wb = XLSX.read(ab);
    const sheetName = wb.SheetNames[0];
    if (!sheetName) return yield* Effect.fail(new Error("No sheetname"));
    const sheet = wb.Sheets[sheetName]!;

    return XLSX.utils.sheet_to_json<T>(sheet, { defval: null });
  });
}

type DatabaseItem = {
  sku: string; // Ej: "COMBO-1-CANCAT-016|1-CANCAT-017"
  skuOriginal: string; // Ej: "CANCAT-016"
  nombreOriginal: string; // Ej: "COMBO SILICAS CANCAT 16 LTS"
  barcode: string; // Ej: "7798296857363"
  cantidad: number; // Ej: 1.00
};

const FieldContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="flex flex-col gap-2 p-4 border-2 rounded-md min-w-96">
    {children}
  </div>
);

export const handle: BreadcrumbHandle = () => ({
  route: "/",
  label: "Home",
});

const Home = () => {
  const [formatColumns, setFormatColumns] = useState<(string | null)[]>([]);
  const [database, setDatabase] = useState<
    Array<Record<string, string | number | null>> | undefined
  >();
  const [handleMap, setHandleMap] = useState(false);
  const [mapeos, setMapeos] = useState([crypto.randomUUID()]);

  function handleAddMapeo() {
    setMapeos((current) => [...current, crypto.randomUUID()]);
  }

  useEffect(() => {
    const databaseString = window.localStorage.getItem(FormFields.database);
    if (databaseString === null) return;

    const databaseJson = JSON.parse(databaseString) as typeof database;
    setDatabase(databaseJson);
  }, []);

  function handleChangeFormatFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.item(0);

    if (!(file instanceof File)) return setFormatColumns([]);

    pipe(
      Effect.succeed(file),
      Effect.flatMap(xlsxToJson<unknown>),
      Effect.map((rows) => rows[0] as Record<string, unknown>[]),
      Effect.map((row) => Object.keys(row)),
      Effect.tap(setFormatColumns),
      Effect.runPromise
    );
  }

  function handleChangeMapSwitch() {
    setHandleMap((current) => !current);
  }

  function handleChangeDatabase(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.item(0);

    if (!(file instanceof File)) return;

    pipe(
      Effect.succeed(file),
      Effect.flatMap(xlsxToJson<DatabaseItem>),
      Effect.tap((json) =>
        window.localStorage.setItem(FormFields.database, JSON.stringify(json))
      ),
      Effect.tap(() => Effect.log("Guardado", database)),
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
        <Label htmlFor={FormFields.database}>
          Base de datos: {database ? "Cargada" : "Sin cargar"}
        </Label>
        <Input
          type="file"
          accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          id={FormFields.database}
          name={FormFields.database}
          onChange={handleChangeDatabase}
        />
        <Input
          type="text"
          name={FormFields.databaseJson}
          value={database ? JSON.stringify(database) : ""}
          readOnly
          hidden
        />
      </FieldContainer>
      <FieldContainer>
        <Label htmlFor={FormFields.formatFile}>Selecciona la plantilla:</Label>
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
        <Label htmlFor={FormFields.formatInstructions}>
          Instrucciones para el formato de salida:
        </Label>

        <Textarea
          name={FormFields.formatInstructions}
          placeholder="Instrucciones para el formato de salida (opcional)"
          className="h-32"
        ></Textarea>
      </FieldContainer>
      <FieldContainer>
        <h2>
          Mapeo de columnas{" "}
          <Switch checked={handleMap} onClick={handleChangeMapSwitch} />
        </h2>
        <input
          type="text"
          name={FormFields.handleMap}
          value={String(handleMap)}
          readOnly
          hidden
        />
        {formatColumns.length && database && handleMap ? (
          <>
            <Label>Clave de indice</Label>
            <div className="flex gap-2">
              <NativeSelect name={FormFields.indexKeyDB}>
                {formatColumns
                  .filter((fc) => fc !== null)
                  .map((fc) => (
                    <NativeSelectOption key={fc} value={fc}>
                      {fc}
                    </NativeSelectOption>
                  ))}
              </NativeSelect>
              <ArrowRight />
              <NativeSelect name={FormFields.indexKeyFormat}>
                {Object.keys(database[0])
                  .filter((fc) => fc !== null)
                  .map((fc) => (
                    <NativeSelectOption key={fc} value={fc}>
                      {fc}
                    </NativeSelectOption>
                  ))}
              </NativeSelect>
            </div>
            <Label>Claves de mapeo</Label>
            {mapeos.map((uuid) => (
              <div className="flex gap-2" key={uuid}>
                <NativeSelect name={FormFields.mapKeyDB}>
                  {formatColumns
                    .filter((fc) => fc !== null)
                    .map((fc) => (
                      <NativeSelectOption key={fc} value={fc}>
                        {fc}
                      </NativeSelectOption>
                    ))}
                </NativeSelect>
                <ArrowRight />
                <NativeSelect name={FormFields.mapKeyFormat}>
                  {Object.keys(database[0])
                    .filter((fc) => fc !== null)
                    .map((fc) => (
                      <NativeSelectOption key={fc} value={fc}>
                        {fc}
                      </NativeSelectOption>
                    ))}
                </NativeSelect>
              </div>
            ))}
            <Button onClick={handleAddMapeo}>Agregar mapeo</Button>
          </>
        ) : (
          "Carga plantilla, base de datos y habilita el mapeo..."
        )}
      </FieldContainer>
      <FieldContainer>
        <Label htmlFor={FormFields.inputFiles}>Upload files:</Label>
        <Input
          type="file"
          id={FormFields.inputFiles}
          name={FormFields.inputFiles}
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
          multiple
          required
        />
        <Label htmlFor={FormFields.inputInstructions}>
          Additional Instructions:
        </Label>
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
