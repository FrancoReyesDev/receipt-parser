import { useState } from "react";

export function useTmpFile() {
  const [files, setFiles] = useState<File[] | undefined>();
  const [fileUrl, setFileUrl] = useState<string | undefined>();

  const handleDropFile = (files: File[]) => {
    setFiles(files);
    setFileUrl(URL.createObjectURL(files[0]));
  };

  const handleRemoveFile = () => {
    setFiles(undefined);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(undefined);
    }
  };

  return {
    handleDropFile,
    handleRemoveFile,
    files,
    fileUrl,
  };
}
