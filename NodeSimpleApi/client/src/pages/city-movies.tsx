import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Film } from "@shared/schema";
import MovieList from "@/components/movie-list";

export default function CityMovies() {
  const { city } = useParams();
  const [genre, setGenre] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const { data, isLoading, error } = useQuery<{ data: { city: string, films: Film[] } }>({
    queryKey: [`/api/films/by-city/${city}${genre ? `?genre=${genre}` : ''}`],
  });
  
  const filteredFilms = data?.data.films.filter(film => 
    film.titre.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Movies in {city}</h1>
        <p className="text-muted-foreground">
          Discover the latest films showing in theaters in {city}
        </p>
      </div>
      
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-3">
          <Label htmlFor="search" className="text-muted-foreground mb-2 block">Search Films</Label>
          <Input
            id="search"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="genre" className="text-muted-foreground mb-2 block">Filter by Genre</Label>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger id="genre" className="w-full">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Genres</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="drama">Drama</SelectItem>
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="romance">Romance</SelectItem>
              <SelectItem value="thriller">Thriller</SelectItem>
              <SelectItem value="horror">Horror</SelectItem>
              <SelectItem value="sci-fi">Sci-Fi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-[180px] w-full rounded-md mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="text-center py-8">
          <p className="text-destructive mb-2">Error loading movies</p>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      )}
      
      {!isLoading && !error && (
        <>
          {filteredFilms.length > 0 ? (
            <MovieList films={filteredFilms} mode="browse" />
          ) : (
            <div className="text-center py-12">
              <p className="text-xl font-medium mb-2">No movies found</p>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? `No results for "${searchTerm}"${genre ? ` in genre "${genre}"` : ''}`
                  : genre 
                    ? `No movies found in genre "${genre}"`
                    : `No movies currently showing in ${city}`
                }
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
