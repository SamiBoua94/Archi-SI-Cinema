import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Movie } from "@/lib/types";

export function MovieTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: movies, isLoading, error } = useQuery<Movie[]>({
    queryKey: ["/api/theater/movies"],
  });

  const deleteMovieMutation = useMutation({
    mutationFn: (movieId: number) => {
      return apiRequest("DELETE", `/api/theater/movies/${movieId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/theater/movies"] });
      toast({
        title: "Success",
        description: "Movie deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete movie",
        variant: "destructive",
      });
    },
  });

  const handleDeleteMovie = (movieId: number) => {
    deleteMovieMutation.mutate(movieId);
  };

  // Function to format duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="border rounded-lg">
          <div className="bg-gray-100 p-3">
            <Skeleton className="h-6 w-full" />
          </div>
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="p-4 border-t">
              <div className="flex items-center">
                <Skeleton className="h-10 w-16 rounded mr-4" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">
          Failed to load movies: {error.toString()}
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">You haven't added any movies yet.</p>
        <Link href="/theater/add-movie">
          <Button className="bg-[#E50914] hover:bg-[#E50914]/90 text-white">
            Add Your First Movie
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h4 className="text-xl font-bold font-['Montserrat'] mb-4">
        Current Movies
      </h4>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="font-medium text-gray-700 uppercase">Movie</TableHead>
              <TableHead className="font-medium text-gray-700 uppercase">Duration</TableHead>
              <TableHead className="font-medium text-gray-700 uppercase">Language</TableHead>
              <TableHead className="font-medium text-gray-700 uppercase">Created At</TableHead>
              <TableHead className="font-medium text-gray-700 uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div 
                      className="h-10 w-16 bg-cover bg-center rounded" 
                      style={{ backgroundImage: `url('${movie.poster}')` }}
                      aria-label={`${movie.title} poster`}
                    ></div>
                    <div className="ml-4">
                      <div className="font-medium">{movie.title}</div>
                      <div className="text-sm text-gray-500">{movie.ageRating}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{formatDuration(movie.duration)}</TableCell>
                <TableCell className="text-sm">
                  {movie.language}{movie.subtitles ? " (ST)" : ""}
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(movie.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/theater/edit-movie/${movie.id}`}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{movie.title}" and all its associated schedules. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteMovie(movie.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
