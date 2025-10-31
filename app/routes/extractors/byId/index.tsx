import { Effect, Layer, pipe } from "effect";
import type { Route } from "./+types";

import { DropzoneFileViewer } from "~/modules/extractors/infra/ui/components/dropzone-file-viewer";
import { NewExtractorForm } from "~/modules/extractors/infra/ui/components/new-extractor-form";
import { useTmpFile } from "~/modules/extractors/infra/ui/hooks/useTmpFile";
import { ExtractorRepositoryPort } from "~/modules/extractors/application/ports/ExtractorRepository.port";
import { KVNamespaceTag } from "~/modules/extractors/infra/tags/KVNamespace.tag";
import { AuthContextTag } from "~/modules/auth/application/tags/AuthContext.tag";
import { ExtractorKVRepositoryAdapter } from "~/modules/extractors/infra/adapters/ExtractorKVRepository.adapter";
import type { BreadcrumbHandle } from "~/components/root/app-breadcrumb";

export const handle: BreadcrumbHandle = (match) => ({
  route: "#",
  label:
    (match.loaderData as Route.ComponentProps["loaderData"]).extractor === null
      ? "Nuevo"
      : "Existente",
});

const AppLive = (
  kvNamespace: KVNamespace,
  authContext: { orgId: string; userId: string }
) => {
  const KvNamespaceLive = Layer.succeed(KVNamespaceTag, kvNamespace);
  const AuthContextLive = Layer.succeed(AuthContextTag, authContext);
  const ExtractorRepositoryLive = ExtractorKVRepositoryAdapter.pipe(
    Layer.provide(KvNamespaceLive),
    Layer.provide(AuthContextLive)
  );
  return ExtractorRepositoryLive;
};

export function loader({ params, context }: Route.LoaderArgs) {
  const { id } = params;
  const kvNamespace = context.cloudflare.env.docular_ai;

  const program = pipe(
    ExtractorRepositoryPort,
    Effect.flatMap((repo) => repo.get(id)),
    Effect.match({
      onSuccess: (extractor) => ({ extractor }),
      onFailure: () => ({ extractor: null }),
    })
  );

  return pipe(
    program,
    Effect.provide(AppLive(kvNamespace, { orgId: "test", userId: "test" })),
    Effect.runPromise
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { fileUrl, handleDropFile, handleRemoveFile } = useTmpFile();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
      <NewExtractorForm />
      <DropzoneFileViewer
        fileUrl={fileUrl}
        handleDropFile={handleDropFile}
        onRemoveFile={handleRemoveFile}
      />
    </div>
  );
}
