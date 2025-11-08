"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Location } from "@/lib/types";
import { MapPin } from "lucide-react";

interface LocationFilterProps {
  locations: Location[];
  selectedLocationId?: string;
}

export function LocationFilter({
  locations,
  selectedLocationId,
}: LocationFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLocationChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "todas") {
      params.delete("ubicacion");
    } else {
      params.set("ubicacion", value);
    }
    router.push(`/cartelera?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 py-2 px-3 bg-card rounded-xl shadow-card">
      <MapPin className="h-5 w-5 text-accent" />
      <Select
        value={selectedLocationId || "todas"}
        onValueChange={handleLocationChange}
      >
        <SelectTrigger className="w-[280px] bg-background text-foreground border-border shadow focus:ring-2 focus:ring-accent/60 rounded-lg font-medium tracking-wide">
          <SelectValue placeholder="Selecciona una ubicación" />
        </SelectTrigger>
        <SelectContent className="bg-card shadow-card border-card rounded-lg">
          <SelectItem
            value="todas"
            className={`py-2 hover:bg-accent/30 font-semibold transition-all duration-100 ${
              !selectedLocationId ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Todas las ubicaciones
          </SelectItem>
          {locations.map((location) => (
            <SelectItem
              key={location.id}
              value={location.id}
              className={`py-2 hover:bg-accent/30 font-semibold transition-all duration-100 ${
                selectedLocationId === location.id
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {location.name}{" "}
              <span className="cine-tag ml-1">{location.city}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
