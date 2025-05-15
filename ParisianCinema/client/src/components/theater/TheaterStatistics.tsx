import { useQuery } from "@tanstack/react-query";
import { FilmIcon, EyeIcon, StarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Movie } from "@/lib/types";

export function TheaterStatistics() {
  const { data: movies, isLoading } = useQuery<Movie[]>({
    queryKey: ["/api/theater/movies"],
  });

  // For demo purposes, we'll generate some statistics based on the available movies
  // In a real app, these would be calculated on the server
  const totalMovies = movies?.length || 0;
  const upcomingMovies = Math.floor(totalMovies * 0.6); // 60% of movies are "upcoming" for demo
  const currentlyPlaying = totalMovies - upcomingMovies;
  
  // Mock monthly views - would be real data in production
  const monthlyViews = Math.floor(Math.random() * 3000) + 1000;
  const percentIncrease = Math.floor(Math.random() * 20) + 5;
  
  // Find most popular movie (random selection for demo)
  const mostPopularMovie = movies && movies.length > 0
    ? movies[Math.floor(Math.random() * movies.length)]
    : null;
  
  // Mock weekly views for most popular movie
  const weeklyViews = Math.floor(Math.random() * 1000) + 500;

  if (isLoading) {
    return (
      <div>
        <h4 className="text-xl font-bold font-['Montserrat'] mb-4">
          Theater Statistics
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-xl font-bold font-['Montserrat'] mb-4">
        Theater Statistics
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-semibold">Total Movies</h5>
            <FilmIcon className="text-[#E50914] text-xl" size={20} />
          </div>
          <p className="text-3xl font-bold">{totalMovies}</p>
          <p className="text-sm text-gray-600">
            {currentlyPlaying} currently playing, {upcomingMovies} upcoming
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-semibold">This Month's Views</h5>
            <EyeIcon className="text-[#E50914] text-xl" size={20} />
          </div>
          <p className="text-3xl font-bold">{monthlyViews.toLocaleString()}</p>
          <p className="text-sm text-gray-600">
            +{percentIncrease}% from last month
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-semibold">Most Popular</h5>
            <StarIcon className="text-[#E50914] text-xl" size={20} />
          </div>
          <p className="text-xl font-bold line-clamp-1">
            {mostPopularMovie?.title || "No movies yet"}
          </p>
          <p className="text-sm text-gray-600">
            {mostPopularMovie ? `${weeklyViews.toLocaleString()} views this week` : "Add movies to see statistics"}
          </p>
        </div>
      </div>
    </div>
  );
}
