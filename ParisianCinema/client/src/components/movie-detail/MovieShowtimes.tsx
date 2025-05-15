import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieWithSchedule } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";

interface MovieShowtimesProps {
  movie: MovieWithSchedule;
}

export function MovieShowtimes({ movie }: MovieShowtimesProps) {
  const { user } = useAuth();
  
  // Function to format the date in a readable format
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get the days of the week the movie is showing
  const getShowDays = (schedule: MovieWithSchedule['schedule']) => {
    const days = [];
    if (schedule.monday) days.push('Monday');
    if (schedule.tuesday) days.push('Tuesday');
    if (schedule.wednesday) days.push('Wednesday');
    if (schedule.thursday) days.push('Thursday');
    if (schedule.friday) days.push('Friday');
    if (schedule.saturday) days.push('Saturday');
    if (schedule.sunday) days.push('Sunday');
    
    return days.join(', ');
  };

  // Function to format time from HH:MM:SS to 12-hour format
  const formatTime = (time: string) => {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold font-['Montserrat'] mb-4">
        Showtimes in {user?.city || 'Paris'}
      </h2>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg font-['Montserrat']">
              {user?.theaterName || 'Le Grand Rex'}
            </h3>
            <p className="text-sm text-gray-600">
              {user?.address || '1 Boulevard Poissonnière'}, {user?.city || '75002 Paris'}
            </p>
          </div>
          <a
            href={`https://maps.google.com?q=${user?.address || '1 Boulevard Poissonnière'}, ${user?.city || 'Paris'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E50914] hover:text-[#E50914]/80 text-sm font-semibold mt-2 sm:mt-0 flex items-center"
          >
            <MapPin className="mr-1" size={16} />
            View on Map
          </a>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-2">{getShowDays(movie.schedule)}</h4>
          <div className="flex flex-wrap gap-2">
            {movie.schedule.showtimes.map((showtime, index) => (
              <Button
                key={index}
                variant="outline"
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
              >
                {formatTime(showtime.startTime)}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600">
            Playing from {formatDate(movie.schedule.startDate)} to {formatDate(movie.schedule.endDate)}
          </p>
        </div>
      </div>
    </div>
  );
}
