import { MovieWithSchedule } from "@/lib/types";

interface MovieCastProps {
  movie: MovieWithSchedule;
}

export function MovieCast({ movie }: MovieCastProps) {
  // Split the actors string into an array
  const actorsList = movie.actors.split(',').map(actor => actor.trim());
  
  // Sample images for cast members (in a real app, these would come from the database)
  const castImages = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold font-['Montserrat'] mb-4">Cast & Crew</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Director */}
        <div className="flex flex-col items-center">
          <div
            className="w-20 h-20 rounded-full bg-cover bg-center mb-2"
            style={{ backgroundImage: `url('${castImages[2]}')` }}
            aria-label={`${movie.director} profile`}
          ></div>
          <span className="font-medium">{movie.director}</span>
          <span className="text-sm text-gray-600">Director</span>
        </div>

        {/* Actors */}
        {actorsList.slice(0, 3).map((actor, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="w-20 h-20 rounded-full bg-cover bg-center mb-2"
              style={{ backgroundImage: `url('${castImages[index % castImages.length]}')` }}
              aria-label={`${actor} profile`}
            ></div>
            <span className="font-medium">{actor}</span>
            <span className="text-sm text-gray-600">
              {index === 0 ? "Lead Actor" : index === 1 ? "Lead Actress" : "Supporting Actor"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
