import type { BreadcrumbHandle } from "~/components/root/app-breadcrumb";
import type { Route } from "./+types";

export const handle: BreadcrumbHandle = {
  route: "/extractors",
  label: (loaderData) =>
    (loaderData as Route.ComponentProps["loaderData"]).hola,
};

export function loader() {
  return { hola: "alfa romeo" };
}

export default function ExtractorPage({ params }: Route.ComponentProps) {
  return <>{params.id}</>;
}
