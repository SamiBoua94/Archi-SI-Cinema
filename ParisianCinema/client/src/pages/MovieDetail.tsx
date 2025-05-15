import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MovieDetailHero } from "@/components/movie-detail/MovieDetailHero";
import { MovieCast } from "@/components/movie-detail/MovieCast";
import { MovieShowtimes } from "@/components/movie-detail/MovieShowtimes";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MovieWithSchedule } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";

export default function MovieDetail() {
  const { id } = useParams();
  
  const { data: movie, isLoading, error } = useQuery<MovieWithSchedule>({
    queryKey: [`/api/movies/${id}`],
  });

  if (isLoading) {
    return (
      <section className="min-h-[80vh]">
        <div className="mb-4">
          <Button variant="ghost" className="text-[#E50914]">
            <ArrowLeft className="mr-2" size={16} />
            Back to Movies
          </Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 md:h-96 bg-gray-900">
            <Skeleton className="absolute inset-0" />
          </div>
          <div className="p-6 md:p-8">
            <Skeleton className="h-64 w-full md:hidden mb-6" />
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !movie) {
    return (
      <section className="min-h-[80vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">
          {error ? "Error Loading Movie" : "Movie Not Found"}
        </h2>
        <p className="text-gray-600 mb-6">
          {error instanceof Error ? error.message : "The requested movie could not be found."}
        </p>
        <Link href="/movies">
          <Button className="bg-[#E50914] hover:bg-[#E50914]/90 text-white">
            Browse Movies
          </Button>
        </Link>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{movie.title} | Movie Details | CinéParis</title>
        <meta 
          name="description" 
          content={`Get details about ${movie.title}. ${movie.synopsis ? movie.synopsis.substring(0, 150) + '...' : 'View showtimes, cast, and more information about this film playing in Paris theaters.'}`}
        />
      </Helmet>
      
      <section className="min-h-[80vh]">
        <div className="mb-4">
          <Link href="/movies">
            <a className="text-[#E50914] hover:text-[#E50914]/80 inline-flex items-center">
              <ArrowLeft className="mr-2" size={16} />
              Back to Movies
            </a>
          </Link>
        </div>

        <MovieDetailHero movie={movie} />
        <MovieCast movie={movie} />
        <MovieShowtimes movie={movie} />
      </section>
    </>
  );
}
