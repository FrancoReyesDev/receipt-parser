import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card } from "~/components/ui/card";
import { PlusIcon, TrashIcon, SparklesIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";

interface Field {
  id: string;
  label: string;
  prompt: string;
  dataType: string;
}

export function NewExtractorForm() {
  const [extractorName, setExtractorName] = useState("");
  const [fields, setFields] = useState<Field[]>([
    {
      id: "1",
      label: "Número de Factura",
      prompt: "",
      dataType: "text",
    },
    {
      id: "2",
      label: "Fecha",
      prompt: "Formato DD/MM/YYYY",
      dataType: "date",
    },
    {
      id: "3",
      label: "Total",
      prompt: "",
      dataType: "number",
    },
  ]);

  const addField = () => {
    const newField: Field = {
      id: Date.now().toString(),
      label: "",
      prompt: "",
      dataType: "text",
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const updateField = (id: string, key: keyof Field, value: string) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Configurar Extractor</h2>
        <p className="text-sm text-muted-foreground">
          Define los campos que deseas extraer del documento
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {/* Extractor Name */}
        <div className="space-y-2">
          <Label htmlFor="extractor-name">Nombre del Extractor</Label>
          <Input
            id="extractor-name"
            placeholder="Ej: Facturas AFIP"
            value={extractorName}
            onChange={(e) => setExtractorName(e.target.value)}
          />
        </div>

        {/* Fields Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Campos a Extraer</Label>
            <Badge variant="secondary" className="text-xs">
              {fields.length} {fields.length === 1 ? "campo" : "campos"}
            </Badge>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">
                      Campo {index + 1}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeField(field.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor={`label-${field.id}`} className="text-xs">
                      Etiqueta del Campo
                    </Label>
                    <Input
                      id={`label-${field.id}`}
                      placeholder="Ej: Número de Factura"
                      value={field.label}
                      onChange={(e) =>
                        updateField(field.id, "label", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`prompt-${field.id}`} className="text-xs">
                      Instrucciones (opcional)
                    </Label>
                    <Textarea
                      id={`prompt-${field.id}`}
                      placeholder="Ej: Formato DD/MM/YYYY, buscar en la esquina superior derecha"
                      value={field.prompt}
                      onChange={(e) =>
                        updateField(field.id, "prompt", e.target.value)
                      }
                      rows={2}
                      className="resize-none text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`type-${field.id}`} className="text-xs">
                      Tipo de Dato
                    </Label>
                    <Select
                      value={field.dataType}
                      onValueChange={(value) =>
                        updateField(field.id, "dataType", value)
                      }
                    >
                      <SelectTrigger id={`type-${field.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="number">Número</SelectItem>
                        <SelectItem value="date">Fecha</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Teléfono</SelectItem>
                        <SelectItem value="currency">Moneda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={addField}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Agregar Campo
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t flex gap-3">
        <Button variant="outline" className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button className="flex-1">
          <SparklesIcon className="h-4 w-4 mr-2" />
          Crear Extractor
        </Button>
      </div>
    </div>
  );
}
