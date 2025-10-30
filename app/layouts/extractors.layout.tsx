import { Outlet } from "react-router";
import type { BreadcrumbHandle } from "~/components/root/app-breadcrumb";

export const handle: BreadcrumbHandle = () => ({
  route: "/extractors",
  label: "Extractores",
});

export default function ExtractorsLayout() {
  return (
    <main className="p-2 h-full">
      <Outlet />
    </main>
  );
}
