import { Plus } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function ExtractorsPage() {
  return (
    <header className="flex gap-2 max-w-[400px]">
      <Button variant={"outline"} asChild>
        <Link to={"./new"}>
          <Plus />
          Crear Nuevo Extractor
        </Link>
      </Button>
      <Input type="text" placeholder="Buscar" />
      {/* Filtrar por tipo de documento... maybe? */}
    </header>
  );
}
