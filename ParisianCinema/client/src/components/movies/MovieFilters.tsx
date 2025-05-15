import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, AGE_RATINGS, SORT_OPTIONS } from "@/lib/constants";

interface MovieFiltersProps {
  ville: string;
  onFilterChange: (filters: Record<string, string>) => void;
}

export function MovieFilters({ ville, onFilterChange }: MovieFiltersProps) {
  const [langue, setLangue] = useState<string>("");
  const [ageMinimum, setAgeMinimum] = useState<string>("");
  const [sort, setSort] = useState<string>("popular");

  useEffect(() => {
    // Déclencher le changement de filtre (convertir "all-languages" et "all-ratings" en chaîne vide pour l'API)
    onFilterChange({
      ville,
      langue: langue === "all-languages" ? "" : langue,
      ageMinimum: ageMinimum === "all-ratings" ? "" : ageMinimum,
      sort,
    });
  }, [ville, langue, ageMinimum, sort, onFilterChange]);

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6 space-y-4">
      <h2 className="text-xl font-semibold">Filtres</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="font-medium text-sm">Langue</label>
          <Select
            value={langue || "all-languages"}
            onValueChange={setLangue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Toutes les langues" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-languages">Toutes les langues</SelectItem>
              {LANGUAGES.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="font-medium text-sm">Âge minimum</label>
          <Select
            value={ageMinimum || "all-ratings"}
            onValueChange={setAgeMinimum}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Toutes les classifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-ratings">Toutes les classifications</SelectItem>
              {AGE_RATINGS.map((rating) => (
                <SelectItem key={rating} value={rating}>
                  {rating}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="font-medium text-sm">Trier par</label>
          <Select
            value={sort}
            onValueChange={setSort}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Popularité" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}