import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { FilmWithProgrammations } from "@/lib/types";
import { DEFAULT_POSTER_URL } from "@/lib/constants";

interface MovieCardProps {
  film: FilmWithProgrammations;
}

export function MovieCard({ film }: MovieCardProps) {
  // Calculer le nombre de cinémas qui projettent ce film
  const uniqueCinemaIdsMap: Record<number, boolean> = {};
  film.programmations.forEach(p => {
    uniqueCinemaIdsMap[p.cinemaId] = true;
  });
  const cinemaCount = Object.keys(uniqueCinemaIdsMap).length;

  // Formatter la durée du film (ex: 135 -> 2h 15m)
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Link href={`/film/${film.id}`}>
      <a className="block transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg">
        <Card className="h-full overflow-hidden">
          <div className="aspect-[2/3] overflow-hidden relative">
            <img 
              src={film.poster || DEFAULT_POSTER_URL} 
              alt={film.titre}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <Badge variant="secondary" className="bg-black/60 text-white border-none">
                {film.ageMinimum}
              </Badge>
              {film.sousTitres && (
                <Badge variant="secondary" className="bg-black/60 text-white border-none">
                  ST
                </Badge>
              )}
            </div>
          </div>
          <CardHeader className="py-3 px-4">
            <CardTitle className="line-clamp-1 text-base font-semibold">
              {film.titre}
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3 px-4 pt-0">
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ClockIcon className="size-3.5" />
                <span>{formatDuration(film.duree)}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-3.5" />
                <span>{cinemaCount} cinéma{cinemaCount > 1 ? 's' : ''}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}