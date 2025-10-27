import { Outlet } from "react-router";

export const handle = {
  route: "/extractors",
  label: () => "Extractores",
};

export default function ExtractorsLayout() {
  return (
    <main className="p-2 h-full">
      <Outlet />
    </main>
  );
}
