"use client";

import { UploadIcon, FileTextIcon, XIcon } from "lucide-react";
import {
  Dropzone,
  DropzoneEmptyState,
} from "~/components/ui/shadcn-io/dropzone";
import { Button } from "~/components/ui/button";

interface Props {
  fileUrl: string | undefined;
  handleDropFile: (files: File[]) => void;
  onRemoveFile?: () => void;
}

export function DropzoneFileViewer({
  fileUrl,
  handleDropFile,
  onRemoveFile,
}: Props) {
  if (fileUrl) {
    return (
      <div className="flex flex-col h-full gap-4">
        {/* Compact header with file info and replace button */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex size-8 items-center justify-center rounded bg-muted text-muted-foreground shrink-0">
              <FileTextIcon size={16} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">Documento cargado</p>
              <p className="text-xs text-muted-foreground">
                Vista previa del archivo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Dropzone onDrop={handleDropFile}>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-transparent"
              >
                Reemplazar
              </Button>
            </Dropzone>
            {onRemoveFile && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={onRemoveFile}
              >
                <XIcon size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Full preview iframe */}
        <div className="flex-1 min-h-0">
          <iframe
            src={fileUrl}
            className="w-full h-full rounded-md border"
            style={{ border: "1px solid hsl(var(--border))" }}
          />
        </div>
      </div>
    );
  }

  return (
    <Dropzone onDrop={handleDropFile}>
      <DropzoneEmptyState>
        <div className="flex flex-col items-center justify-center w-full p-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground mb-4">
            <UploadIcon size={24} />
          </div>
          <p className="font-medium text-sm">Subir un archivo</p>
          <p className="text-muted-foreground text-xs mt-1 text-wrap max-w-md">
            Arrastra o haz clic para cargar un archivo <strong>PDF</strong> o
            una <strong>imagen (JPG, PNG)</strong>. Nuestro modelo de IA
            analizará el documento y extraerá los campos relevantes
            automáticamente.
          </p>
        </div>
      </DropzoneEmptyState>
    </Dropzone>
  );
}
