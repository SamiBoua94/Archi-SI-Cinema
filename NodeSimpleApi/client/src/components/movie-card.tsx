import { Film } from "@shared/schema";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface MovieCardProps {
  film: Film;
}

export default function MovieCard({ film }: MovieCardProps) {
  return (
    <Link href={`/movie/${film.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md cursor-pointer">
        <div className="aspect-[2/3] relative">
          <img 
            src={film.poster} 
            alt={film.titre} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/default-poster.jpg";
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary">{film.age_minimum}</Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold truncate mb-1">{film.titre}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{film.duree} min</span>
            {film.genres && (
              <>
                <span className="mx-1">•</span>
                <span className="truncate">{film.genres}</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
