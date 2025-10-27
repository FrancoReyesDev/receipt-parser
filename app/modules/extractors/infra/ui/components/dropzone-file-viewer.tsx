import { UploadIcon } from "lucide-react";
import {
  Dropzone,
  DropzoneEmptyState,
} from "~/components/ui/shadcn-io/dropzone";

interface Props {
  fileUrl: string | undefined;
  handleDropFile: (files: File[]) => void;
}

export function DropzoneFileViewer({ fileUrl, handleDropFile }: Props) {
  return fileUrl ? (
    <iframe
      src={fileUrl}
      width="100%"
      height="100%"
      style={{ border: "none" }}
    />
  ) : (
    <Dropzone onDrop={handleDropFile}>
      {/* <DropzoneContent /> */}
      <DropzoneEmptyState>
        <div className="flex flex-col items-center justify-center w-full p-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground mb-4">
            <UploadIcon size={24} />
          </div>
          <p className="font-medium text-sm">Upload a file</p>
          <p className="text-muted-foreground text-xs mt-1 text-wrap">
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
