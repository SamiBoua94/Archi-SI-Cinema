import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { FilmWithProgrammations } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  MapPin,
  Film as FilmIcon,
  Globe,
  Users
} from "lucide-react";
import MovieSchedule from "@/components/movie-schedule";

export default function MovieDetails() {
  const { id } = useParams();
  const movieId = parseInt(id);
  
  const { data, isLoading, error } = useQuery<{ data: { film: FilmWithProgrammations } }>({
    queryKey: [`/api/films/${movieId}`],
    enabled: !isNaN(movieId),
  });
  
  const film = data?.data.film;
  
  if (isNaN(movieId)) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Invalid Movie ID</h1>
        <p className="text-muted-foreground mb-6">The movie ID provided is not valid.</p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="h-[400px] w-full md:w-[280px] rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-5 w-1/2 mb-2" />
            <Skeleton className="h-5 w-1/3 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !film) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
        <p className="text-muted-foreground mb-6">
          {error?.message || "We couldn't find the movie you're looking for."}
        </p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 shrink-0">
          <img 
            src={film.poster} 
            alt={film.titre} 
            className="w-full rounded-lg shadow-md object-cover aspect-[2/3]"
            onError={(e) => {
              e.currentTarget.src = "/images/default-poster.jpg";
            }}
          />
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{film.titre}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{film.duree} min</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <FilmIcon className="h-4 w-4 mr-1" />
              <span>{film.genres || 'Unknown genre'}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{film.age_minimum}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Globe className="h-4 w-4 mr-1" />
              <span>{film.langue} {film.sous_titres && '(Subtitled)'}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About the Film</h2>
            <p className="text-muted-foreground mb-4">{film.synopsis || 'No synopsis available.'}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
              <div>
                <span className="font-medium">Director: </span>
                <span className="text-muted-foreground">{film.realisateur}</span>
              </div>
              <div>
                <span className="font-medium">Cast: </span>
                <span className="text-muted-foreground">{film.acteurs_principaux}</span>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Where to Watch</h2>
            
            {film.programmations && film.programmations.length > 0 ? (
              <div className="space-y-4">
                {film.programmations.map((prog) => (
                  <Card key={prog.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{prog.cinema?.nom}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{prog.cinema?.adresse}, {prog.cinema?.ville}</span>
                          </div>
                        </div>
                        
                        <div className="text-right text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{new Date(prog.date_debut).toLocaleDateString()} - {new Date(prog.date_fin).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <MovieSchedule programmation={prog} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                No screenings are currently scheduled for this film.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
