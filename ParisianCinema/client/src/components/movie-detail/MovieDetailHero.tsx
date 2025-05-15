import { Star } from "lucide-react";
import { MovieWithSchedule } from "@/lib/types";

interface MovieDetailHeroProps {
  movie: MovieWithSchedule;
}

export function MovieDetailHero({ movie }: MovieDetailHeroProps) {
  // Format the duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  };

  // Random rating for demo (in a real app, this would come from the database)
  const rating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="relative h-64 md:h-96 bg-gray-900">
        {/* Movie backdrop image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')",
          }}
          aria-hidden="true"
        ></div>
        
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black to-transparent"
          aria-hidden="true"
        ></div>

        {/* Content */}
        <div className="relative h-full flex items-end p-6 md:p-8">
          <div className="w-full md:flex items-end">
            {/* Movie poster - hidden on mobile, shown on desktop */}
            <div
              className="hidden md:block w-48 h-72 bg-cover bg-center rounded-lg shadow-lg mr-8 flex-shrink-0"
              style={{ backgroundImage: `url('${movie.poster}')` }}
              aria-label={`${movie.title} poster`}
            ></div>
            
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded mr-2">
                  TOP RATED
                </span>
                <span className="bg-[#032541] text-white text-xs px-2 py-1 rounded">
                  {movie.ageRating}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-['Montserrat'] mb-2">
                {movie.title}
              </h1>
              <div className="text-gray-300 md:flex items-center mb-4">
                <span className="mr-4">{formatDuration(movie.duration)}</span>
                <span className="mr-4">{movie.language}{movie.subtitles ? " (with subtitles)" : ""}</span>
                <span className="mr-4">{movie.genres || "Drama"}</span>
                <div className="flex items-center mt-2 md:mt-0">
                  <Star className="text-yellow-500 mr-1" size={16} fill="currentColor" />
                  <span>{rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Mobile poster - shown on mobile, hidden on desktop */}
        <div
          className="md:hidden w-full h-64 bg-cover bg-center rounded-lg shadow-lg mb-6"
          style={{ backgroundImage: `url('${movie.poster}')` }}
          aria-label={`${movie.title} poster`}
        ></div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold font-['Montserrat'] mb-4">Synopsis</h2>
          <p className="text-gray-700">
            {movie.synopsis || "No synopsis available."}
          </p>
        </div>
      </div>
    </div>
  );
}
