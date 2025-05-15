import { FilmWithProgrammations } from "@/lib/types";
import { MovieCard } from "./MovieCard";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieGridProps {
  films?: FilmWithProgrammations[];
  isLoading: boolean;
  error?: string;
}

export function MovieGrid({ films, isLoading, error }: MovieGridProps) {
  // Afficher l'état de chargement
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="w-full aspect-[2/3] rounded-lg" />
            <Skeleton className="w-3/4 h-5 rounded" />
            <Skeleton className="w-1/2 h-4 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="p-6 text-center bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  // Afficher un message si aucun film n'est trouvé
  if (!films || films.length === 0) {
    return (
      <div className="p-6 text-center bg-muted rounded-lg">
        <p className="text-muted-foreground">Aucun film ne correspond à vos critères de recherche.</p>
      </div>
    );
  }

  // Afficher la grille de films
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {films.map((film) => (
        <MovieCard key={film.id} film={film} />
      ))}
    </div>
  );
}