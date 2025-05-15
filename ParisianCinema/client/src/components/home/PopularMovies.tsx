import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { MovieCard } from "@/components/movies/MovieCard";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FilmWithProgrammations } from "@/lib/types";

export default function PopularMovies() {
  const { data: films, isLoading } = useQuery<FilmWithProgrammations[]>({
    queryKey: ["/api/films/ville/Paris"],
  });

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-['Montserrat'] text-[#333333]">Films populaires à Paris</h2>
        <Link href="/films/ville/Paris">
          <span className="text-[#E50914] hover:text-[#E50914]/80 font-semibold flex items-center cursor-pointer">
            Voir tous
            <ArrowRight className="ml-2" size={16} />
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Skeleton className="h-64 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))
        ) : !films || films.length === 0 ? (
          <div className="col-span-4 text-center py-10">
            <p className="text-gray-500">Aucun film disponible pour le moment.</p>
          </div>
        ) : (
          // Display up to 4 films
          films.slice(0, 4).map((film) => (
            <MovieCard key={film.id} film={film} />
          ))
        )}
      </div>
    </section>
  );
}
