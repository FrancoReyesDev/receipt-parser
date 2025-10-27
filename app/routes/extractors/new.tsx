import type { BreadcrumbHandle } from "~/components/root/app-breadcrumb";
import { Card } from "~/components/ui/card";

import { DropzoneFileViewer } from "~/modules/extractors/infra/ui/components/dropzone-file-viewer";
import { NewExtractorForm } from "~/modules/extractors/infra/ui/components/new-extractor-form";
import { useTmpFile } from "~/modules/extractors/infra/ui/hooks/useTmpFile";

export const handle: BreadcrumbHandle = {
  route: "",
  label: () => "Nuevo",
};

export default function NewExtractorPage() {
  const { fileUrl, handleDropFile } = useTmpFile();

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <Card className="border rounded-md p-4">
        <DropzoneFileViewer fileUrl={fileUrl} handleDropFile={handleDropFile} />
      </Card>
      <Card className="border rounded-md p-4">
        <NewExtractorForm />
      </Card>
    </div>
  );
}
